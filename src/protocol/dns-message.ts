import { DNSMessageHeader } from './header';
import { Question } from './question';

export class DNSMessage {
  constructor(public header: DNSMessageHeader, public questions: Question[]) {}
}
