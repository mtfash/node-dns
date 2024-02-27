import { DNSMessageHeader, Opcode, Query } from './header';

describe('MessageHeader', () => {
  describe('encodeHeader()', () => {
    it('should correctly encode id field', () => {
      const queryHeader = new DNSMessageHeader({
        id: 0xc212,
        isQuery: true,
        opcode: Opcode.QUERY,
      }).encode();

      expect(queryHeader[0]).toBe(0xc2);
      expect(queryHeader[1]).toBe(0x12);
    });

    it('should correctly encode QR bit', () => {
      const header01 = new DNSMessageHeader({
        id: 0xc212,
        isQuery: true,
        opcode: Opcode.QUERY,
      }).encode();

      expect(header01.readUint32BE() ^ Query.RESPONSE).toBeTruthy();

      const header02 = new DNSMessageHeader({
        id: 0xc212,
        isQuery: false,
        opcode: Opcode.QUERY,
      }).encode();

      expect(header02.readUint32BE() & Query.RESPONSE).toBeTruthy();
    });

    it('should correctly encode opcode field', () => {
      [Opcode.QUERY, Opcode.IQUERY, Opcode.STATUS].forEach((opcode) => {
        const header = new DNSMessageHeader({
          id: 0xc212,
          opcode: opcode,
        }).encode();

        expect(header.readUint32BE() & opcode).toBe(opcode);
      });
    });

    it('should encode the header to correct binary data I', () => {
      const queryHeader = new DNSMessageHeader({
        id: 0xc212,
        isQuery: true,
        opcode: Opcode.QUERY,
        recursionDesired: true,
        qdcount: 1, // 1 entry in the question section
      }).encode();

      const expectedQueryHeader = Buffer.from([
        0xc2, 0x12, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      ]);

      expect(queryHeader).toEqual(expectedQueryHeader);
    });

    it('should encode the header to correct binary data II', () => {
      const responseHeader = new DNSMessageHeader({
        id: 0xfcdb,
        isQuery: false,
        opcode: Opcode.QUERY,
        recursionDesired: true,
        recursionAvailable: true,
        ancount: 2, // 2 RRs in the answer section
        qdcount: 1, // 1 entry in the question section
      }).encode();

      const expectedResponseHeader = Buffer.from([
        0xfc, 0xdb, 0x81, 0x80, 0x00, 0x01, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00,
      ]);

      expect(responseHeader).toEqual(expectedResponseHeader);
    });

    it('should correctly encode ARCOUNT field', () => {
      const responseHeader = new DNSMessageHeader({
        id: 0xfcdb,
        isQuery: false,
        opcode: Opcode.QUERY,
        recursionDesired: true,
        recursionAvailable: true,
        arcount: 1,
      }).encode();

      expect(responseHeader.readUInt16BE(10)).toBe(1);
    });
  });

  describe('decodeHeader()', () => {
    it('should correctly decode message header', () => {
      const buffer = Buffer.from([
        0x24, 0xfc, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      ]);

      const headerDecoded = new DNSMessageHeader(buffer);
      expect(headerDecoded).toBeDefined();
      expect(headerDecoded.id).toBe(0x24fc);
      expect(headerDecoded.isQuery).toBe(true);
      expect(headerDecoded.opcode).toBe(Opcode.QUERY);
      expect(headerDecoded.truncated).toBe(false);
      expect(headerDecoded.recursionDesired).toBeTruthy();
      expect(headerDecoded.recursionAvailable).toBeFalsy();
      expect(headerDecoded.authoritative).toBeFalsy();
      expect(headerDecoded.responseCode).toBe(0);
      expect(headerDecoded.qdcount).toBe(1);
      expect(headerDecoded.ancount).toBe(0);
      expect(headerDecoded.nscount).toBe(0);
      expect(headerDecoded.arcount).toBe(0);
    });
  });
});
