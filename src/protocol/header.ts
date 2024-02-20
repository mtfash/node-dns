/**
 *                                 1  1  1  1  1  1
 *   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
 * +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 * |                      ID                       |
 * +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 * |QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |
 * +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 * |                    QDCOUNT                    |
 * +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 * |                    ANCOUNT                    |
 * +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 * |                    NSCOUNT                    |
 * +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 * |                    ARCOUNT                    |
 * +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 */

export const QRY_RESPONSE = 0b00000000000000001000000000000000;
export const QRY_QUERY = 0;

export enum Query {
  QUERY = QRY_QUERY,
  RESPONSE = QRY_RESPONSE,
}

export const OPCODE_QUERY = 0;
export const OPCODE_IQUERY = 0b00000000000000000000100000000000;
export const OPCODE_STATUS = 0b00000000000000000001000000000000;
export const OPCODE_MASK = 0b00000000000000000111100000000000;

export enum Opcode {
  QUERY = OPCODE_QUERY,
  IQUERY = OPCODE_IQUERY,
  STATUS = OPCODE_STATUS,
}

export const AA = 0b00000000000000000000010000000000; // Authoritative answer
export const TC = 0b00000000000000000000001000000000; // Truncated
export const RD = 0b00000000000000000000000100000000; // Recursion desired
export const RA = 0b00000000000000000000000010000000; // Recursion available

export const RCODE_0 = 0;
export const RCODE_1 = 0b00000000000000000000000000000001;
export const RCODE_2 = 0b00000000000000000000000000000010;
export const RCODE_3 = 0b00000000000000000000000000000011;
export const RCODE_4 = 0b00000000000000000000000000000100;
export const RCODE_5 = 0b00000000000000000000000000000101;
export const RCODE_MASK = 0b00000000000000000000000000001111;

export enum ResponseCode {
  NoError = RCODE_0,
  FormatError = RCODE_1,
  ServerFailure = RCODE_2,
  NameError = RCODE_3,
  NotImplemented = RCODE_4,
  Refused = RCODE_5,
}

type DNSMessageHeader = {
  id: number;
  query: Query;
  opcode: Opcode;
  authoritativeAnswer?: boolean;
  truncated?: boolean;
  recursionDesired?: boolean;
  recursionAvailable?: boolean;
  responseCode?: ResponseCode | undefined;
  qdcount?: number; // Number of entries in the question
  ancount?: number; // Number of resource records in the answer section
  nscount?: number; // Number of name server RRs in the authority records section
  arcount?: number; // number of RRs in the additional records section
};

export class MessageHeader {
  static encode({
    id,
    query,
    opcode,
    authoritativeAnswer,
    truncated,
    recursionDesired,
    recursionAvailable,
    responseCode,
    qdcount,
    ancount,
    nscount,
    arcount,
  }: DNSMessageHeader) {
    const buffer = Buffer.alloc(12, 0, 'ascii');
    buffer.writeUInt16BE(id, 0);
    buffer.writeUInt16BE(
      query |
        opcode |
        (authoritativeAnswer ? AA : 0) |
        (truncated ? TC : 0) |
        (recursionDesired ? RD : 0) |
        (recursionAvailable ? RA : 0) |
        (typeof responseCode === 'number' ? responseCode : 0),
      2
    );

    if (qdcount) buffer.writeUInt16BE(qdcount, 4);
    if (ancount) buffer.writeUInt16BE(ancount, 6);
    if (nscount) buffer.writeUInt16BE(nscount, 8);
    if (arcount) buffer.writeUInt16BE(arcount, 10);

    return buffer;
  }

  static decode(header: Buffer): DNSMessageHeader {
    if (header.byteLength !== 12) {
      throw new Error(
        `Invalid header length: ${header} (${header.byteLength} bytes)`
      );
    }

    const num32Bits = header.readUInt32BE();

    let opcode: Opcode = Opcode.QUERY;
    if ((num32Bits & Opcode.IQUERY) === Opcode.IQUERY) {
      opcode = Opcode.IQUERY;
    } else if ((num32Bits & Opcode.STATUS) === Opcode.STATUS) {
      opcode = Opcode.STATUS;
    } else if ((num32Bits ^ OPCODE_MASK) === OPCODE_MASK) {
      opcode = Opcode.QUERY;
    }

    let rc: ResponseCode = ResponseCode.NoError;
    if ((num32Bits ^ RCODE_MASK) === RCODE_MASK) {
    } else if ((num32Bits & RCODE_1) === RCODE_1) {
      rc = ResponseCode.FormatError;
    } else if ((num32Bits & RCODE_2) === RCODE_2) {
      rc = ResponseCode.ServerFailure;
    } else if ((num32Bits & RCODE_3) === RCODE_3) {
      rc = ResponseCode.NameError;
    } else if ((num32Bits & RCODE_4) === RCODE_4) {
      rc = ResponseCode.NotImplemented;
    } else if ((num32Bits & RCODE_5) === RCODE_5) {
      rc = ResponseCode.Refused;
    }

    return {
      id: header.readUInt16BE(0),
      query: num32Bits & QRY_RESPONSE,
      opcode: opcode,
      authoritativeAnswer: !!(num32Bits & AA),
      truncated: !!(num32Bits & TC),
      recursionDesired: !!(num32Bits & RD),
      recursionAvailable: !!(num32Bits & RA),
      responseCode: rc,
      qdcount: header.readUint16BE(4),
      ancount: header.readUint16BE(6),
      nscount: header.readUint16BE(8),
      arcount: header.readUint16BE(10),
    };
  }
}
