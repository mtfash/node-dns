import { maxUInt16 } from './constants';

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

export type Header = {
  id: number;
  isQuery?: boolean;
  opcode?: Opcode;
  authoritative?: boolean;
  truncated?: boolean;
  recursionDesired?: boolean;
  recursionAvailable?: boolean;
  responseCode?: ResponseCode;
  qdcount?: number;
  ancount?: number;
  nscount?: number;
  arcount?: number;
};

export class DNSMessageHeader {
  id: number;
  isQuery = true;
  opcode = Opcode.QUERY;
  authoritative = false;
  truncated = false;
  recursionDesired = false;
  recursionAvailable = false;
  responseCode = ResponseCode.NoError;
  qdcount = 0;
  ancount = 0;
  nscount = 0;
  arcount = 0;

  constructor(params: Header | Buffer) {
    if ('id' in params) {
      const {
        id,
        isQuery,
        opcode,
        authoritative,
        truncated,
        recursionDesired,
        recursionAvailable,
        responseCode,
        qdcount,
        ancount,
        nscount,
        arcount,
      } = params;

      if (id > maxUInt16 || id < 0) {
        throw new Error('id valud out of range');
      }

      this.id = id;

      if (typeof isQuery !== 'undefined') {
        this.isQuery = isQuery;
      }

      if (typeof opcode !== 'undefined') {
        this.opcode = opcode;
      }

      if (typeof authoritative !== 'undefined') {
        this.authoritative = authoritative;
      }

      if (typeof truncated !== 'undefined') {
        this.truncated = truncated;
      }

      if (typeof recursionDesired !== 'undefined') {
        this.recursionDesired = recursionDesired;
      }

      if (typeof recursionAvailable !== 'undefined') {
        this.recursionAvailable = recursionAvailable;
      }

      if (typeof responseCode !== 'undefined') {
        this.responseCode = responseCode;
      }

      if (typeof qdcount !== 'undefined') {
        if (qdcount < 0 || qdcount > maxUInt16) {
          throw new Error('qdcount value out of range');
        }

        this.qdcount = qdcount;
      }

      if (typeof ancount !== 'undefined') {
        if (ancount < 0 || ancount > maxUInt16) {
          throw new Error('ancount value out of range');
        }

        this.ancount = ancount;
      }

      if (typeof nscount !== 'undefined') {
        if (nscount < 0 || nscount > maxUInt16) {
          throw new Error('nscount value out of range');
        }

        this.nscount = nscount;
      }

      if (typeof arcount !== 'undefined') {
        if (arcount < 0 || arcount > maxUInt16) {
          throw new Error('arcount value out of range');
        }

        this.arcount = arcount;
      }
    } else {
      const buffer = params;
      if (buffer.byteLength !== 12) {
        throw new Error(
          `Invalid header length: ${buffer} (${buffer.byteLength} bytes)`
        );
      }

      const num32Bits = buffer.readUInt32BE();

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
        rc = ResponseCode.NoError;
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

      this.id = buffer.readUInt16BE(0);
      this.isQuery = (num32Bits & QRY_RESPONSE) === 0;
      this.opcode = opcode;
      this.authoritative = !!(num32Bits & AA);
      this.truncated = !!(num32Bits & TC);
      this.recursionDesired = !!(num32Bits & RD);
      this.recursionAvailable = !!(num32Bits & RA);
      this.responseCode = rc;
      this.qdcount = buffer.readUint16BE(4);
      this.ancount = buffer.readUint16BE(6);
      this.nscount = buffer.readUint16BE(8);
      this.arcount = buffer.readUint16BE(10);
    }
  }

  encode(): Buffer {
    const buffer = Buffer.alloc(12, 0, 'ascii');

    const query = this.isQuery ? Query.QUERY : Query.RESPONSE;

    buffer.writeUInt16BE(this.id, 0);
    buffer.writeUInt16BE(
      query |
        this.opcode |
        (this.authoritative ? AA : 0) |
        (this.truncated ? TC : 0) |
        (this.recursionDesired ? RD : 0) |
        (this.recursionAvailable ? RA : 0) |
        this.responseCode,
      2
    );

    buffer.writeUInt16BE(this.qdcount, 4);
    buffer.writeUInt16BE(this.ancount, 6);
    buffer.writeUInt16BE(this.nscount, 8);
    buffer.writeUInt16BE(this.arcount, 10);

    return buffer;
  }
}
