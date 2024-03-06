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
      id: 0x8d46,
      isQuery: false,
      recursionDesired: true,
      recursionAvailable: true,
      qdcount: 1,
      ancount: 2,
    })
  )
  .withQuestions([
    new QuestionEntry({
      qname: 'graph.instagram.com',
      qtype: QTYPE.AAAA,
      qclass: QCLASS.IN,
    }),
  ])
  .withAnswer([
    new ResourceRecord({
      name: 'graph.instagram.com',
      type: QTYPE.CNAME,
      cls: CLASS.IN,
      ttl: 2210,
      rdlength: 17,
      rdata: 'instagram.c10r.instagram.com',
    }),
    new ResourceRecord({
      name: 'instagram.c10r.instagram.com',
      type: QTYPE.AAAA,
      cls: CLASS.IN,
      ttl: 47,
      rdlength: 16,
      rdata: '2a03:2880:f242:cb:face:b00c:0:43fe',
    }),
  ])
  .build();

const encoder = new DNSEncoder(dnsMessage);
const buffer = encoder.encode();
console.log(buffer.toString('hex'));
