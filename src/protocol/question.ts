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

  constructor(params: Question | Buffer) {
    if ('qname' in params) {
      const { qname, qtype, qclass } = params;
      this.qname = qname;
      this.qtype = qtype;
      this.qclass = qclass;
    } else {
      const question = params as Buffer;
      const { domain, endOffset } = decodeDomainFrom(question, 0);
      const qtype: QTYPE = question.readUInt16BE(endOffset + 1);
      const qclass: QCLASS = question.readUInt16BE(endOffset + 3);
      this.qname = domain;
      this.qtype = qtype;
      this.qclass = qclass;
    }
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
