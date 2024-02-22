import { decodeLabel, encodeLabel } from './label';

describe('Labels', () => {
  describe('encodeLabel()', () => {
    it('should correctly encode label string to an array of octets', () => {
      const labelStr = 'www';
      const buffer = encodeLabel(labelStr);

      expect(buffer[0]).toBe(3);
      expect(buffer[1]).toBe(0x77);
      expect(buffer[2]).toBe(0x77);
      expect(buffer[3]).toBe(0x77);
      expect(buffer.byteLength).toBe(4);
    });

    it('should correctly encode null label', () => {
      const labelStr = '';
      const buffer = encodeLabel(labelStr);

      expect(buffer[0]).toBe(0);
      expect(buffer.byteLength).toBe(1);
    });
  });

  describe('decodeLabel()', () => {
    it('should correctly decode a label buffer to its string representation', () => {
      const www = new Uint8Array([3, 0x77, 0x77, 0x77]);
      const wwwStr = decodeLabel(www);

      expect(wwwStr).toBe('www');

      const maxLengthLabel = Buffer.alloc(64, 0x77, 'ascii');
      maxLengthLabel.writeUInt8(63);
      const maxLengthLabelStr = decodeLabel(maxLengthLabel);

      expect(maxLengthLabelStr.length).toBe(63);
      expect(maxLengthLabelStr[0]).toBe('w');
      expect(maxLengthLabelStr[62]).toBe('w');
    });

    it("should throw if the length octet does not match label's length", () => {
      const invalidLengthLabel = Buffer.alloc(64, 0x77, 'ascii');
      invalidLengthLabel.writeUInt8(5);
      expect(() => decodeLabel(invalidLengthLabel)).toThrow();
    });
  });
});
