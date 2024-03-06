import { DNSEncoder } from './protocol/dns-encoder';
import { DNSMessageBuilder } from './protocol/dns-message-builder';
import { DNSMessageHeader } from './protocol/header';
import { ResourceRecord } from './protocol/resource-record';
import { QuestionEntry } from './protocol/question';
import { QCLASS } from './values/qclass';
import { CLASS } from './values/class';
import { QTYPE } from './values/qtype';

const dnsMessageBuilder = new DNSMessageBuilder();

const dnsMessage = dnsMessageBuilder
  .withHeader(
    new DNSMessageHeader({
      id: 0x8739,
      isQuery: false,
      recursionDesired: true,
      recursionAvailable: true,
      qdcount: 1,
      ancount: 2,
    })
  )
  .withQuestions([
    new QuestionEntry({
      qname: 'gateway.instagram.com',
      qtype: QTYPE.A,
      qclass: QCLASS.IN,
    }),
  ])
  .withAnswer([
    new ResourceRecord({
      name: 'gateway.instagram.com',
      type: QTYPE.CNAME,
      cls: CLASS.IN,
      ttl: 2219,
      rdlength: 20,
      rdata: 'dgw.c10r.facebook.com',
    }),
    new ResourceRecord({
      name: 'dgw.c10r.facebook.com',
      type: QTYPE.A,
      cls: CLASS.IN,
      ttl: 40,
      rdlength: 4,
      rdata: '157.240.195.3',
    }),
  ])
  .build();

const encoder = new DNSEncoder(dnsMessage);
const buffer = encoder.encode();

console.log(buffer.toString('hex'));
