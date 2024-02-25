import { Opcode, ResponseCode } from './header';
import { Question } from './question';

export class DNSMessage {
  constructor(
    public id: number,
    public isQuery: boolean,
    public opcode: Opcode,
    public authoritative: boolean,
    public truncated: boolean,
    public recursionDesired: boolean,
    public recursionAvailable: boolean,
    public responseCode: ResponseCode,
    public qdcount: number,
    public ancount: number,
    public nscount: number,
    public arcount: number,
    public questions: Question[]
  ) {}
}
