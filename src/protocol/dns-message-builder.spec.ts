import { maxUInt16 } from './constants';
import { DNSMessageBuilder } from './dns-message-builder';
import { DNSMessageHeader, Opcode, ResponseCode } from './header';

describe('DNSMessageBuilder', () => {
  let builder: DNSMessageBuilder;

  beforeEach(() => {
    builder = new DNSMessageBuilder();
  });

  describe('setId()', () => {
    it('should set the id property of target DNSMessage object', () => {
      const message = builder
        .withHeader(new DNSMessageHeader({ id: 1234 }))
        .build();

      expect(message.header).toBeDefined();
      expect(message.header.id).toBe(1234);
    });
  });

  describe('setIsQuery()', () => {
    it('should set the query type of target DNSMessage object', () => {
      const message = builder
        .withHeader(new DNSMessageHeader({ id: 1234, isQuery: true }))
        .build();

      expect(message.header).toBeDefined();
      expect(message.header.isQuery).toBe(true);
    });
  });

  describe('setOpcode()', () => {
    it('should set the opcode of the target DNSMessage object', () => {
      const message = builder
        .withHeader(new DNSMessageHeader({ id: 1234, opcode: Opcode.IQUERY }))
        .build();

      expect(message.header).toBeDefined();
      expect(message.header.opcode).toBe(Opcode.IQUERY);
    });
  });

  describe('setIsAuthoritative()', () => {
    it('should set the authoritative property of the target DNSMessage object', () => {
      const message = builder
        .withHeader(new DNSMessageHeader({ id: 1234, authoritative: true }))
        .build();

      expect(message.header).toBeDefined();
      expect(message.header.authoritative).toBe(true);
    });
  });

  describe('setTruncated()', () => {
    it('should set the truncated property of the target DNSMessage object', () => {
      const message = builder
        .withHeader(new DNSMessageHeader({ id: 1234, truncated: true }))
        .build();

      expect(message.header).toBeDefined();
      expect(message.header.truncated).toBe(true);
    });
  });

  describe('setRecursionDesired()', () => {
    it('should set the recursionDesired property of the target DNSMessage object', () => {
      const message = builder
        .withHeader(new DNSMessageHeader({ id: 1234, recursionDesired: true }))
        .build();

      expect(message.header).toBeDefined();
      expect(message.header.recursionDesired).toBe(true);
    });
  });

  describe('setRecursionAvailable()', () => {
    it('should set the recursionAvailable property of the target DNSMessage object', () => {
      const header = new DNSMessageHeader({
        id: 1234,
        recursionAvailable: true,
      });
      const message = builder.withHeader(header).build();

      expect(message.header).toBeDefined();
      expect(message.header.recursionAvailable).toBe(true);
    });
  });

  describe('setResponseCode()', () => {
    it('should set the responseCode property of the target DNSMessage object', () => {
      const rcode = ResponseCode.NotImplemented;
      const header = new DNSMessageHeader({ id: 1234, responseCode: rcode });
      const message = builder.withHeader(header).build();
      expect(message.header.responseCode).toBe(rcode);
    });
  });

  describe('setQDCount()', () => {
    it('should set the qdcount property of the target DNSMessage object', () => {
      const header = new DNSMessageHeader({ id: 1234, qdcount: 5 });
      const message = builder.withHeader(header).build();
      expect(message.header.qdcount).toBe(5);
    });

    it('should throw an error if a value outside the acceptable range is provided', () => {
      expect(() => {
        new DNSMessageHeader({ id: 1234, qdcount: -1 });
      }).toThrow('out of range');

      expect(() => {
        new DNSMessageHeader({
          id: 1234,
          qdcount: maxUInt16 + 1,
        });
      }).toThrow('out of range');
    });
  });

  describe('setANCount()', () => {
    it('should set the ancount property of the target DNSMessage object', () => {
      const header = new DNSMessageHeader({ id: 1234, ancount: 3 });
      const message = builder.withHeader(header).build();
      expect(message.header.ancount).toBe(3);
    });

    it('should throw an error if a value outside the acceptable range is provided', () => {
      expect(() => {
        new DNSMessageHeader({ id: 1234, ancount: -1 });
      }).toThrow('out of range');

      expect(() => {
        new DNSMessageHeader({ id: 1234, ancount: maxUInt16 + 1 });
      }).toThrow('out of range');
    });
  });

  describe('setNSCount()', () => {
    it('should set the nscount property of the target DNSMessage object', () => {
      const header = new DNSMessageHeader({ id: 1234, nscount: 8 });
      const message = builder.withHeader(header).build();
      expect(message.header.nscount).toBe(8);
    });

    it('should throw an error if a value outside the acceptable range is provided', () => {
      expect(() => {
        new DNSMessageHeader({ id: 1234, nscount: -1 });
      }).toThrow('out of range');

      expect(() => {
        new DNSMessageHeader({ id: 1234, nscount: maxUInt16 + 1 });
      }).toThrow('out of range');
    });
  });

  describe('setARCount()', () => {
    it('should set the arcount property of the target DNSMessage object', () => {
      const header = new DNSMessageHeader({ id: 1234, arcount: 4 });
      const message = builder.withHeader(header).build();
      expect(message.header.arcount).toBe(4);
    });

    it('should throw an error if a value outside the acceptable range is provided', () => {
      expect(() => {
        new DNSMessageHeader({ id: 123, arcount: -1 });
      }).toThrow('out of range');

      expect(() => {
        new DNSMessageHeader({ id: 123, arcount: maxUInt16 + 1 });
      }).toThrow('out of range');
    });
  });
});
