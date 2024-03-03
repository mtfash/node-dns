import { DNSMessage } from './dns-message';
import { DNSMessageHeader } from './header';
import { QuestionEntry } from './question';

export class DNSMessageBuilder {
  private header: DNSMessageHeader;
  private questions: QuestionEntry[] = [];

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

  build(): DNSMessage {
    return new DNSMessage(this.header, this.questions);
  }
}
