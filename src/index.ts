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
      id: 0xaee2,
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
      ttl: 443,
      rdlength: 20,
      rdata: 'dgw.c10r.facebook.com',
    }),
    new ResourceRecord({
      name: 'dgw.c10r.facebook.com',
      type: QTYPE.A,
      cls: CLASS.IN,
      ttl: 10,
      rdlength: 4,
      rdata: '157.240.195.3',
    }),
  ])
  .build();

const encoder = new DNSEncoder(dnsMessage);
const buffer = encoder.encode();

console.log(buffer.toString('hex'));

// wireshark output: aee281800001000200000000076761746577617909696e7374616772616d03636f6d0000010001c00c00050001000001bb00140364677704633130720866616365626f6f6bc01ec033000100010000000a00049df0c303
// encoder output:   aee281800001000200000000076761746577617909696e7374616772616d03636f6d0000010001c00c00050001000001bb00140364677704633130720866616365626f6f6b03636f6d00c033000100010000000a00040000009d000000f0000000c300000003
