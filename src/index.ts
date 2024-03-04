import { DNSEncoder } from './protocol/dns-encoder';
import { DNSMessageBuilder } from './protocol/dns-message-builder';
import { DNSMessageHeader } from './protocol/header';
import { QuestionEntry } from './protocol/question';
import { ResourceRecord } from './protocol/resource-record';
import { CLASS } from './values/class';
import { QCLASS } from './values/qclass';
import { QTYPE } from './values/qtype';

const dnsMessageBuilder = new DNSMessageBuilder();

const dnsMessage = dnsMessageBuilder
  .withHeader(
    new DNSMessageHeader({
      id: 0x6d52,
      isQuery: false,
      recursionDesired: true,
      recursionAvailable: true,
      qdcount: 1,
      ancount: 1,
    })
  )
  .withQuestions([
    new QuestionEntry({
      qname: 'signaler-pa.clients6.google.com',
      qtype: QTYPE.AAAA,
      qclass: QCLASS.IN,
    }),
  ])
  .withAnswer([
    new ResourceRecord({
      name: 'signaler-pa.clients6.google.com',
      type: QTYPE.AAAA,
      cls: CLASS.IN,
      ttl: 46,
      rdlength: 16,
      rdata: '2a00:1450:4019:802::200a',
    }),
  ])
  .build();

const encoder = new DNSEncoder(dnsMessage);
const buffer = encoder.encode();

console.log(buffer.toString('hex'));

// wireshark output: 6d52818000010001000000000b7369676e616c65722d706108636c69656e74733606676f6f676c6503636f6d00001c0001c00c001c00010000002e00102a00145040190802000000000000200a
// encoder output:   6d52818000010001000000000b7369676e616c65722d706108636c69656e74733606676f6f676c6503636f6d00001c0001c00c001c00010000002e0010
