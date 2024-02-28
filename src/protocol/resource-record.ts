import { CLASS } from '../values/class';
import { QTYPE } from '../values/qtype';
import { encodeDomainInto } from './domain';

export class ResourceRecord {
  name: string;
  type: QTYPE;
  cls: CLASS;
  ttl: number;
  rdlength: number;
  rdata: string;

  constructor(params: {
    name: string;
    type: QTYPE;
    cls: CLASS;
    ttl: number;
    rdlength: number;
    rdata: string;
  }) {
    const { name, type, cls, ttl, rdlength, rdata } = params;

    this.name = name;
    this.type = type;
    this.cls = cls;
    this.ttl = ttl;
    this.rdlength = rdlength;
    this.rdata = rdata;
  }

  encode(): Buffer {
    const length =
      this.name.length +
      2 + // 1 octet for first label's length + 1 octet for root label
      2 + // 2 octets for type field
      2 + // 2 octets for class field
      4 + // 4 octets for ttl
      2 + // 2 octets for rdlength field
      this.rdlength; // length of rdata;

    const buff = Buffer.alloc(length);

    const domainLength = encodeDomainInto(this.name, buff);
    buff.writeUint16BE(this.type, domainLength);
    buff.writeUint16BE(this.cls, domainLength + 2);
    buff.writeUint32BE(this.ttl, domainLength + 4);
    buff.writeUint16BE(this.rdlength, domainLength + 8);
    return buff;
  }
}
