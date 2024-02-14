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
    });

    const strRepr = `00000000 00000101
10001101 10000101
00000000 00000000
00000000 00000000
00000000 00000000
00000000 00000000`;

    expect(header.toString()).toBe(strRepr);
  });
});
