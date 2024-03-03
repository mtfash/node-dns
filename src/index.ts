import { DNSEncoder } from './protocol/dns-encoder';
import { DNSMessageBuilder } from './protocol/dns-message-builder';
import { DNSMessageHeader } from './protocol/header';
import { QuestionEntry } from './protocol/question';
import { QCLASS } from './values/qclass';
import { QTYPE } from './values/qtype';

const dnsMessageBuilder = new DNSMessageBuilder();

const dnsMessage = dnsMessageBuilder
  .withHeader(
    new DNSMessageHeader({
      id: 0xa379,
      recursionDesired: true,
      qdcount: 2,
    })
  )
  .withQuestions([
    new QuestionEntry({
      qname: 'contacts.google.com',
      qtype: QTYPE.AAAA,
      qclass: QCLASS.IN,
    }),
    new QuestionEntry({
      qname: 'www.microsoft.com',
      qtype: QTYPE.AAAA,
      qclass: QCLASS.IN,
    }),
  ])
  .build();

const dnsEncoder = new DNSEncoder(dnsMessage);
const buffer = dnsEncoder.encode();

console.log(buffer.toString('hex'));
