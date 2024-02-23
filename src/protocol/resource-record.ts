import { CLASS } from '../values/class';
import { TYPE } from '../values/type';

export type ResourceRecord = {
  name: string;
  type: TYPE;
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

  

  return buff;
}
