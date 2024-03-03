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

console.log(buffer);
