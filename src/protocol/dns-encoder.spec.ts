import { QTYPE } from '../values/qtype';
import { CLASS } from '../values/class';
import { QCLASS } from '../values/qclass';
import { DNSEncoder } from './dns-encoder';
import { DNSMessage } from './dns-message';
import { QuestionEntry } from './question';
import { ResourceRecord } from './resource-record';
import { DNSMessageHeader } from './header';
import { DNSMessageBuilder } from './dns-message-builder';

const builder = new DNSMessageBuilder();
const entries: { message: DNSMessage; base64: string }[] = [
  {
    message: builder
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
      .build(),
    base64: 't4gBAAABAAAAAAAADWdldzEtc3BjbGllbnQHc3BvdGlmeQNjb20AAEEAAQ==',
  },
  {
    message: builder
      .withHeader(
        new DNSMessageHeader({
          id: 0x2307,
          recursionDesired: true,
          qdcount: 1,
        })
      )
      .withQuestions([
        new QuestionEntry({
          qname: 'collector.github.com',
          qtype: QTYPE.A,
          qclass: QCLASS.IN,
        }),
      ])
      .build(),
    base64: 'IwcBAAABAAAAAAAACWNvbGxlY3RvcgZnaXRodWIDY29tAAABAAE=',
  },
  {
    message: builder
      .withHeader(
        new DNSMessageHeader({
          id: 0x2307,
          isQuery: false,
          recursionDesired: true,
          recursionAvailable: true,
          qdcount: 1,
          ancount: 2,
        })
      )
      .withQuestions([
        new QuestionEntry({
          qname: 'collector.github.com',
          qtype: QTYPE.A,
          qclass: QCLASS.IN,
        }),
      ])
      .withAnswer([
        new ResourceRecord({
          name: 'collector.github.com',
          type: QTYPE.CNAME,
          cls: CLASS.IN,
          ttl: 649,
          rdlength: 21,
          rdata: 'glb-db52c2cf8be544.github.com',
        }),
        new ResourceRecord({
          name: 'glb-db52c2cf8be544.github.com',
          type: QTYPE.A,
          cls: CLASS.IN,
          ttl: 50,
          rdlength: 4,
          rdata: '140.82.113.21',
        }),
      ])
      .build(),
    base64:
      'IweBgAABAAIAAAAACWNvbGxlY3RvcgZnaXRodWIDY29tAAABAAHADAAFAAEAAAKJABUSZ2xiLWRiNTJjMmNmOGJlNTQ0wBbAMgABAAEAAAAyAASMUnEV',
  },
  {
    message: builder
      .withHeader(
        new DNSMessageHeader({
          id: 0x6be9,
          recursionDesired: true,
          isQuery: true,
          qdcount: 1,
        })
      )
      .withQuestions([
        new QuestionEntry({
          qname: 'mesu.apple.com',
          qtype: QTYPE.A,
          qclass: QCLASS.IN,
        }),
      ])
      .build(),
    base64: 'a+kBAAABAAAAAAAABG1lc3UFYXBwbGUDY29tAAABAAE=',
  },
  {
    message: builder
      .withHeader(
        new DNSMessageHeader({
          id: 0x620f,
          recursionDesired: true,
          isQuery: true,
          qdcount: 1,
        })
      )
      .withQuestions([
        new QuestionEntry({
          qname: 'ocsp2-lb.apple.com.akadns.net',
          qtype: QTYPE.AAAA,
          qclass: QCLASS.IN,
        }),
      ])
      .build(),
    base64: 'Yg8BAAABAAAAAAAACG9jc3AyLWxiBWFwcGxlA2NvbQZha2FkbnMDbmV0AAAcAAE=',
  },
  {
    message: builder
      .withHeader(
        new DNSMessageHeader({
          id: 0x620f,
          isQuery: false,
          recursionDesired: true,
          recursionAvailable: true,
          qdcount: 1,
          ancount: 3,
        })
      )
      .withAnswer([
        new ResourceRecord({
          name: 'ocsp2-lb.apple.com.akadns.net',
          type: QTYPE.CNAME,
          cls: CLASS.IN,
          ttl: 12,
          rdlength: 21,
          rdata: 'ocsp2.g.aaplimg.com',
        }),
        new ResourceRecord({
          name: 'ocsp2.g.aaplimg.com',
          type: QTYPE.AAAA,
          cls: CLASS.IN,
          ttl: 6,
          rdlength: 16,
          rdata: '2a01:b740:a14:f000::201',
        }),
        new ResourceRecord({
          name: 'ocsp2.g.aaplimg.com',
          type: QTYPE.AAAA,
          cls: CLASS.IN,
          ttl: 6,
          rdlength: 16,
          rdata: '2a01:b740:a14:f000::197',
        }),
      ])
      .build(),
    base64:
      'Yg+BgAABAAMAAAAACG9jc3AyLWxiBWFwcGxlA2NvbQZha2FkbnMDbmV0AAAcAAHADAAFAAEAAAAMABUFb2NzcDIBZwdhYXBsaW1nA2NvbQDAOwAcAAEAAAAGABAqAbdAChTwAAAAAAAAAAIBwDsAHAABAAAABgAQKgG3QAoU8AAAAAAAAAABlw==',
  },
];

describe('DNSEncoder', () => {
  describe('encode()', () => {
    it('should correctly encode a DNSMessage object to its octet array representation', () => {
      entries.slice(0, 2).forEach(({ message, base64 }) => {
        const dnsEncoder = new DNSEncoder(message);
        const buffer = dnsEncoder.encode();

        expect(buffer.toString('base64')).toBe(base64);
      });
    });
  });
});
