import { DNSMessage } from './dns-message';
import { DNSMessageHeader } from './header';
import { QuestionEntry } from './question';
import { ResourceRecord } from './resource-record';

export class DNSMessageBuilder {
  private header: DNSMessageHeader;
  private questions: QuestionEntry[] = [];
  private answer: ResourceRecord[] = [];
  private authority: ResourceRecord[] = [];
  private additional: ResourceRecord[] = [];

  constructor() {
    this.header = new DNSMessageHeader({ id: 1 });
  }

  withHeader(header: DNSMessageHeader): DNSMessageBuilder {
    this.header = header;

    this.header.qdcount = this.questions.length;
    this.header.ancount = this.answer.length;
    this.header.nscount = this.authority.length;
    this.header.arcount = this.additional.length;

    return this;
  }

  withQuestions(questions: QuestionEntry[]): DNSMessageBuilder {
    this.questions = questions;

    if (this.header) {
      this.header.qdcount = this.questions.length;
    }

    return this;
  }

  addQuestion(question: QuestionEntry): DNSMessageBuilder {
    this.questions.push(question);

    if (this.header) {
      this.header.qdcount = this.questions.length;
    }

    return this;
  }

  withAnswers(resourceRecords: ResourceRecord[]): DNSMessageBuilder {
    this.answer = resourceRecords;

    if (this.header) {
      this.header.ancount = this.answer.length;
    }

    return this;
  }

  addAnswer(resourceRecord: ResourceRecord): DNSMessageBuilder {
    this.answer.push(resourceRecord);

    if (this.header) {
      this.header.ancount = this.answer.length;
    }

    return this;
  }

  withAuthority(resourceRecords: ResourceRecord[]): DNSMessageBuilder {
    this.authority = resourceRecords;

    if (this.header) {
      this.header.nscount = this.authority.length;
    }

    return this;
  }

  addAuthority(resourceRecord: ResourceRecord): DNSMessageBuilder {
    this.authority.push(resourceRecord);

    if (this.header) {
      this.header.nscount = this.authority.length;
    }

    return this;
  }

  withAdditional(resourceRecords: ResourceRecord[]): DNSMessageBuilder {
    this.additional = resourceRecords;

    if (this.header) {
      this.header.arcount = this.additional.length;
    }

    return this;
  }

  addAdditional(resourceRecord: ResourceRecord): DNSMessageBuilder {
    this.additional.push(resourceRecord);

    if (this.header) {
      this.header.arcount = this.additional.length;
    }

    return this;
  }

  build(): DNSMessage {
    return new DNSMessage(
      this.header,
      this.questions,
      this.answer,
      this.authority,
      this.additional
    );
  }
}
