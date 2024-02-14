import { MessageHeader, Opcode, Query, ResponseCode } from './header';

describe('MessageHeader', () => {
  it('should encode the header to correct binary data', () => {
    const header = new MessageHeader({
      id: 5,
      query: Query.RESPONSE,
      authoritativeAnswer: true,
      opcode: Opcode.IQUERY,
      recursionDesired: true,
      responseCode: ResponseCode.Refused,
      truncated: false,
      recursionAvailable: true,
      qdcount: 1,
      ancount: 2,
      nscount: 3,
      arcount: 4,
    });

    const strRepr = `00000000 00000101
10001101 10000101
00000000 00000001
00000000 00000010
00000000 00000011
00000000 00000100`;

    expect(header.toString()).toBe(strRepr);
  });
});
