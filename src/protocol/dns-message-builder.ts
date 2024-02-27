import { DNSMessage } from './dns-message';
import { DNSMessageHeader } from './header';
import { Question } from './question';

export class DNSMessageBuilder {
  private header: DNSMessageHeader;
  private questions: Question[] = [];

  constructor() {
    this.header = new DNSMessageHeader({ id: 1 });
  }

  withHeader(header: DNSMessageHeader): DNSMessageBuilder {
    this.header = header;
    return this;
  }

  build(): DNSMessage {
    return new DNSMessage(this.header, this.questions);
  }
}
