import { CLASS } from '../values/class';
import { QTYPE } from '../values/qtype';
import { encodeDomainInto } from './domain';

export type ResourceRecord = {
  name: string;
  type: QTYPE;
  cls: CLASS;
  ttl: number;
  rdlength: number;
  rdata: string;
};

export function encodeRR({
  name,
  type,
  cls,
  ttl,
  rdlength,
  rdata,
}: ResourceRecord): Buffer {
  const length =
    name.length +
    2 + // 1 octet for first label's length + 1 octet for root label
    2 + // 2 octets for type field
    2 + // 2 octets for class field
    4 + // 4 octets for ttl
    2 + // 2 octets for rdlength field
    rdlength; // length of rdata;

  const buff = Buffer.alloc(length);

  const domainLength = encodeDomainInto(name, buff);
  buff.writeUint16BE(type, domainLength);
  buff.writeUint16BE(cls, domainLength + 2);
  buff.writeUint32BE(ttl, domainLength + 4);
  buff.writeUint16BE(rdlength, domainLength + 8);

  // write rdata field

  return buff;
}
