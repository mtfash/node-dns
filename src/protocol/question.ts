import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';
import { encodeDomain } from './domain';

export type Question = {
  qname: string;
  qtype: QTYPE;
  qclass: QCLASS;
};

export function encodeQuestion({ qname, qtype, qclass }: Question): Buffer {
  const qnameBuff = encodeDomain(qname);
  const buff = Buffer.alloc(qnameBuff.byteLength + 4);
  buff.set(qnameBuff, 0);
  buff.writeUint16BE(qtype, qnameBuff.length);
  buff.writeUint16BE(qclass, qnameBuff.length + 2);
  return buff;
}
