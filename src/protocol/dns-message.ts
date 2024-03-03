import { DNSMessageHeader } from './header';
import { QuestionEntry } from './question';
import { ResourceRecord } from './resource-record';

export class DNSMessage {
  constructor(
    public header: DNSMessageHeader,
    public questions: QuestionEntry[],
    public answer: ResourceRecord[],
    public authority: ResourceRecord[],
    public additional: ResourceRecord[]
  ) {}
}
