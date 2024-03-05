import { CLASS } from '../values/class';
import { QTYPE } from '../values/qtype';

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
}
