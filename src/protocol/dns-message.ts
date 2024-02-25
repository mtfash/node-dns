import { Opcode, ResponseCode } from './header';
import { Question } from './question';

export class DNSMessage {
  _isQuery: boolean;

  constructor(
    private id: number,
    isQuery: boolean,
    private opcode: Opcode,
    private authoritative: boolean,
    private truncated: boolean,
    private recursionDesired: boolean,
    private recursionAvailable: boolean,
    private responseCode: ResponseCode,
    private qdcount: number,
    private ancount: number,
    private nscount: number,
    private arcount: number,
    private questions: Question[]
  ) {
    this._isQuery = isQuery;
  }

  getId() {
    return this.id;
  }

  isQuery() {
    return this._isQuery;
  }

  isResponse() {
    return !this._isQuery;
  }

  getOpcode() {
    return this.opcode;
  }

  isAuthoritative() {
    return this.authoritative;
  }

  isTruncated() {
    return this.truncated;
  }

  isRecursionDesired() {
    return this.recursionDesired;
  }

  isRecursionAvailable() {
    return this.recursionAvailable;
  }

  getResponseCode() {
    return this.responseCode;
  }

  getQDCount() {
    return this.qdcount;
  }

  getANCount() {
    return this.ancount;
  }

  getNSCount() {
    return this.nscount;
  }

  getARCount() {
    return this.arcount;
  }

  getQuestions(): Question[] {
    return this.questions;
  }
}
