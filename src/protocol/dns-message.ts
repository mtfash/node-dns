import { DNSMessageHeader } from './header';
import { QuestionEntry } from './question';

export class DNSMessage {
  constructor(
    public header: DNSMessageHeader,
    public questions: QuestionEntry[]
  ) {}
}
