import { encodeQuestion } from './protocol/question';
import { QCLASS } from './values/qclass';
import { QTYPE } from './values/qtype';

const question = encodeQuestion({
  qname: 'gs-loc-new.ls-apple.com.akadns.net',
  qtype: QTYPE.HTTPS,
  qclass: QCLASS.IN,
});

console.log(question.toString('base64'));
