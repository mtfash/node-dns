import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';

type Question = {
  qname: string;
  qtype: QTYPE;
  qclass: QCLASS;
};

export class QuestionEntry {
  qname: string;
  qtype: QTYPE;
  qclass: QCLASS;

  constructor(params: Question) {
    const { qname, qtype, qclass } = params;
    this.qname = qname;
    this.qtype = qtype;
    this.qclass = qclass;
  }
}
