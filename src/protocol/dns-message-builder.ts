import { DNSMessage } from './dns-message';
import { Opcode, ResponseCode } from './header';
import { Question } from './question';

const maxUInt16 = Math.pow(2, 16) - 1;

export class DNSMessageBuilder {
  private id = 0;
  private isQuery = false;
  private opcode = Opcode.QUERY;
  private authoritative = false;
  private truncated = false;
  private recursionDesired = false;
  private recursionAvailable = false;
  private responseCode = ResponseCode.NoError;
  private qdcount = 0;
  private ancount = 0;
  private nscount = 0;
  private arcount = 0;
  private questions: Question[] = [];

  setId(id: number): DNSMessageBuilder {
    this.id = id;
    return this;
  }

  setIsQuery(isQuery: boolean): DNSMessageBuilder {
    this.isQuery = isQuery;
    return this;
  }

  setOpcode(opcode: Opcode): DNSMessageBuilder {
    this.opcode = opcode;
    return this;
  }

  setIsAuthoritative(authoritative: boolean): DNSMessageBuilder {
    this.authoritative = authoritative;
    return this;
  }

  setTruncated(truncated: boolean): DNSMessageBuilder {
    this.truncated = truncated;
    return this;
  }

  setRecursionDesired(recursionDesired: boolean): DNSMessageBuilder {
    this.recursionDesired = recursionDesired;
    return this;
  }

  setRecursionAvailable(recursionAvailable: boolean): DNSMessageBuilder {
    this.recursionAvailable = recursionAvailable;
    return this;
  }

  setResponseCode(responseCode: ResponseCode): DNSMessageBuilder {
    this.responseCode = responseCode;
    return this;
  }

  setQDCount(count: number): DNSMessageBuilder {
    this.qdcount = count;
    return this;
  }

  setANCount(count: number): DNSMessageBuilder {
    this.ancount = count;
    return this;
  }

  setNSCount(count: number): DNSMessageBuilder {
    this.nscount = count;
    return this;
  }

  setARCount(count: number): DNSMessageBuilder {
    this.arcount = count;
    return this;
  }

  setQuestions(questions: Question[]): DNSMessageBuilder {
    this.questions = questions;
    return this;
  }

  build(): DNSMessage {
    return new DNSMessage(
      this.id,
      this.isQuery,
      this.opcode,
      this.authoritative,
      this.truncated,
      this.recursionDesired,
      this.recursionAvailable,
      this.responseCode,
      this.qdcount,
      this.ancount,
      this.nscount,
      this.arcount,
      this.questions
    );
  }
}
