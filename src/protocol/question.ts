import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';
import { decodeDomainFrom, encodeDomain } from './domain';

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
