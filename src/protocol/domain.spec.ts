import { decodeDomain, encodeDomain, encodeDomainInto } from './domain';

describe('Domain', () => {
  describe('encodeDomain()', () => {
    it('should correctly encode a domain name to an array of octets', () => {
      const domain = 'www.microsoft.com';
      const buffer = encodeDomain(domain);

      expect(buffer.byteLength).toBe(19);
      expect(buffer[0]).toBe(3);
      expect(buffer[18]).toBe(0);
      expect(buffer[4]).toBe(9);
    });

    it('should correctly encode domain name strings with last dot to an array of octets', () => {
      const domain = 'www.microsoft.com.';
      const buffer = encodeDomain(domain);

      expect(buffer.byteLength).toBe(19);
      expect(buffer[0]).toBe(3);
      expect(buffer[4]).toBe(9);
      expect(buffer[18]).toBe(0);
    });
  });

  describe('encodeDomainInto()', () => {
    it('should correctly encode domain name into a target buffer', () => {
      const domain = 'www.abc.com.';
      const buffer = Buffer.alloc(40, 1);

      const offset = 5;
      const length = encodeDomainInto(domain, buffer, offset);

      expect(length).toBe(13);
      expect(buffer.subarray(offset, offset + length)).toEqual(
        Buffer.from([
          0x03, 0x77, 0x77, 0x77, 0x03, 0x61, 0x62, 0x63, 0x03, 0x63, 0x6f,
          0x6d, 0x00,
        ])
      );
    });
  });

  describe('decodeDomain()', () => {
    it('should correctly decode a domain buffer to its string representation', () => {
      const buffer = new Uint8Array([
        0x03, 0x77, 0x77, 0x77, 0x09, 0x6d, 0x69, 0x63, 0x72, 0x6f, 0x73, 0x6f,
        0x66, 0x74, 0x03, 0x63, 0x6f, 0x6d, 0x00,
      ]);

      const domain = decodeDomain(buffer);

      expect(domain).toBe('www.microsoft.com');
    });
  });
});
