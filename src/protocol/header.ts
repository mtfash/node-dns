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

const QRY_RESPONSE = 0b00000000000000001000000000000000;
const QRY_QUERY = 0;

export enum Query {
  QUERY = QRY_QUERY,
  RESPONSE = QRY_RESPONSE,
}

const OPCODE_QUERY = 0;
const OPCODE_IQUERY = 0b00000000000000000000100000000000;
const OPCODE_STATUS = 0b00000000000000000001000000000000;

export enum Opcode {
  QUERY = OPCODE_QUERY,
  IQUERY = OPCODE_IQUERY,
  STATUS = OPCODE_STATUS,
}

const AA = 0b00000000000000000000010000000000; // Authoritative answer
const TC = 0b00000000000000000000001000000000; // Truncated
const RD = 0b00000000000000000000000100000000; // Recursion desired
const RA = 0b00000000000000000000000010000000; // Recursion available

const RCODE_0 = 0;
const RCODE_1 = 0b00000000000000000000000000000001;
const RCODE_2 = 0b00000000000000000000000000000010;
const RCODE_3 = 0b00000000000000000000000000000011;
const RCODE_4 = 0b00000000000000000000000000000100;
const RCODE_5 = 0b00000000000000000000000000000101;

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
  authoritativeAnswer: boolean | undefined;
  truncated: boolean;
  recursionDesired: boolean;
  recursionAvailable?: boolean;
  responseCode: ResponseCode | undefined;
  qdcount: number; // Number of entries in the question
  ancount: number; // Number of resource records in the answer section
  nscount: number; // Number of name server RRs in the authority records section
  arcount: number; // number of RRs in the additional records section
};

export class MessageHeader {
  buffer: Buffer;

  constructor({
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
    this.buffer = Buffer.alloc(12, 0, 'binary');
    this.buffer.writeUInt16BE(id, 0);
    this.buffer.writeUInt16BE(
      query |
        opcode |
        (authoritativeAnswer ? AA : 0) |
        (truncated ? TC : 0) |
        (recursionDesired ? RD : 0) |
        (recursionAvailable ? RA : 0) |
        (typeof responseCode === 'number' ? responseCode : 0),
      2
    );

    this.buffer.writeUInt16BE(qdcount, 4);
    this.buffer.writeUInt16BE(ancount, 6);
    this.buffer.writeUInt16BE(nscount, 8);
    this.buffer.writeUInt16BE(arcount, 10);
  }

  toString() {
    const bytes: string[] = [];
    for (let i = 0; i < 12; i += 2) {
      const b1 = this.buffer.readUInt8(i).toString(2).padStart(8, '0');
      const b2 = this.buffer
        .readUInt8(i + 1)
        .toString(2)
        .padStart(8, '0');
      bytes.push(`${b1} ${b2}`);
    }
    return `${bytes.join('\n')}`;
  }
}
