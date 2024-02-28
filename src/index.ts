import { encodeDomainInto } from './protocol/domain';
import { QuestionEntry } from './protocol/question';
import { encodeRR } from './protocol/resource-record';
import { CLASS } from './values/class';
import { QCLASS } from './values/qclass';
import { QTYPE } from './values/qtype';

const question = new QuestionEntry({
  qname: 'gs-loc-new.ls-apple.com.akadns.net',
  qtype: QTYPE.HTTPS,
  qclass: QCLASS.IN,
}).encode();

console.log(question.toString('base64'));

const questionBuff = Buffer.from([
  0x0a, 0x67, 0x73, 0x2d, 0x6c, 0x6f, 0x63, 0x2d, 0x6e, 0x65, 0x77, 0x08, 0x6c,
  0x73, 0x2d, 0x61, 0x70, 0x70, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d, 0x06, 0x61,
  0x6b, 0x61, 0x64, 0x6e, 0x73, 0x03, 0x6e, 0x65, 0x74, 0x00, 0x00, 0x41, 0x00,
  0x01,
]);

const questionDecoded = new QuestionEntry(questionBuff);

console.log(JSON.stringify(questionDecoded, null, 2));

const buff = Buffer.alloc(40, 1);
const offset = 5;

const abcLength = encodeDomainInto('www.abc.com.', buff, offset);

console.log(buff, abcLength);

const localhostLength = encodeDomainInto('localhost', buff, abcLength + offset);

console.log(buff, localhostLength);

const rr = encodeRR({
  name: 'ab.chatgpt.com',
  type: QTYPE.AAAA,
  cls: CLASS.IN,
  ttl: 67,
  rdlength: 16,
  rdata: '2606:4700:4400::ac40:9b8d',
});
