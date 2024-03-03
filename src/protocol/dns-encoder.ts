import { DNSMessage } from './dns-message';
import { AA, Query, RA, RD, TC } from './header';

export class DNSEncoder {
  private buffer: Buffer;

  constructor(private message: DNSMessage) {
    this.buffer = Buffer.alloc(512, 0, 'binary');
  }

  encodeLabel(label: string, offset: number): number {
    const { length } = label;

    if (length > 63) {
      throw new Error(`Invalid label length: ${label} (${length})`);
    }

    this.buffer.writeUint8(length, offset);
    this.buffer.set(Buffer.from(label, 'ascii'), offset + 1);

    return length + 1; // label length + 1 byte length byte
  }

  encodeDomain(domain: string, offset: number): number {
    const labels = domain.split('.');

    if (!domain.endsWith('.')) {
      labels.push('');
    }

    let index = offset;

    labels.forEach((label) => {
      const labelLength = this.encodeLabel(label, index);
      index += labelLength;
    });

    return index - offset;
  }

  private encodeHeader() {
    const { header } = this.message;

    const query = header.isQuery ? Query.QUERY : Query.RESPONSE;

    this.buffer.writeUInt16BE(header.id, 0);
    this.buffer.writeUInt16BE(
      query |
        header.opcode |
        (header.authoritative ? AA : 0) |
        (header.truncated ? TC : 0) |
        (header.recursionDesired ? RD : 0) |
        (header.recursionAvailable ? RA : 0) |
        header.responseCode,
      2
    );

    this.buffer.writeUInt16BE(header.qdcount, 4);
    this.buffer.writeUInt16BE(header.ancount, 6);
    this.buffer.writeUInt16BE(header.nscount, 8);
    this.buffer.writeUInt16BE(header.arcount, 10);
  }

  private encodeQuestions() {
    const { questions } = this.message;

    let offset = 12;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]!;
      const domainLength = this.encodeDomain(question.qname, offset);

      const _offset = offset + domainLength;

      this.buffer.writeUint16BE(question.qtype, _offset);
      this.buffer.writeUint16BE(question.qclass, _offset + 2);

      offset += domainLength + 4;
    }
  }

  encode(): Buffer {
    this.encodeHeader();
    this.encodeQuestions();

    return this.buffer;
  }
}
