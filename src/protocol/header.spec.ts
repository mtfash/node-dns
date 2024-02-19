import { MessageHeader, Opcode, Query } from './header';

describe('MessageHeader', () => {
  it('should encode the header to correct binary data', () => {
    const header = MessageHeader.encode({
      id: 0xc212,
      query: Query.QUERY,
      opcode: Opcode.QUERY,
      authoritativeAnswer: false,
      recursionDesired: true,
      truncated: false,
      qdcount: 1,
    });

    const expected = Buffer.from([
      0xc2, 0x12, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);

    expect(expected).toEqual(header);
  });
});
