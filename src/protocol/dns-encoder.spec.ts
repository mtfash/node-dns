import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';
import { DNSEncoder } from './dns-encoder';
import { DNSMessageBuilder } from './dns-message-builder';
import { DNSMessageHeader } from './header';
import { QuestionEntry } from './question';

describe('DNSEncoder', () => {
  describe('encode()', () => {
    it('should correctly encode a DNSMessage object to its octet array representation', () => {
      const dnsMessageBuilder = new DNSMessageBuilder();

      const dnsMessage = dnsMessageBuilder
        .withHeader(
          new DNSMessageHeader({
            id: 0xb788,
            recursionDesired: true,
            qdcount: 1,
          })
        )
        .withQuestions([
          new QuestionEntry({
            qname: 'gew1-spclient.spotify.com',
            qtype: QTYPE.HTTPS,
            qclass: QCLASS.IN,
          }),
        ])
        .build();

      const dnsEncoder = new DNSEncoder(dnsMessage);
      const buffer = dnsEncoder.encode();

      expect(buffer.toString('base64')).toBe(
        't4gBAAABAAAAAAAADWdldzEtc3BjbGllbnQHc3BvdGlmeQNjb20AAEEAAQ=='
      );
    });
  });
});
