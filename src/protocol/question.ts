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

  encode(): Buffer {
    const qnameBuff = encodeDomain(this.qname);
    const buff = Buffer.alloc(qnameBuff.byteLength + 4);
    buff.set(qnameBuff, 0);
    buff.writeUint16BE(this.qtype, qnameBuff.length);
    buff.writeUint16BE(this.qclass, qnameBuff.length + 2);
    return buff;
  }
}
