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
    return this;
  }

  withQuestions(questions: QuestionEntry[]): DNSMessageBuilder {
    this.questions = questions;
    return this;
  }

  addQuestion(question: QuestionEntry): DNSMessageBuilder {
    this.questions.push(question);
    return this;
  }

  withAnswer(resourceRecords: ResourceRecord[]): DNSMessageBuilder {
    this.answer = resourceRecords;
    return this;
  }

  addAnswer(resourceRecord: ResourceRecord): DNSMessageBuilder {
    this.answer.push(resourceRecord);
    return this;
  }

  withAuthority(resourceRecords: ResourceRecord[]): DNSMessageBuilder {
    this.authority = resourceRecords;
    return this;
  }

  addAuthority(resourceRecord: ResourceRecord): DNSMessageBuilder {
    this.authority.push(resourceRecord);
    return this;
  }

  withAdditional(resourceRecords: ResourceRecord[]): DNSMessageBuilder {
    this.additional = resourceRecords;
    return this;
  }

  addAdditional(resourceRecord: ResourceRecord): DNSMessageBuilder {
    this.additional.push(resourceRecord);
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
