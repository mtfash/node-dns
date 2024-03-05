import { DNSMessage } from './dns-message';
import { AA, Query, RA, RD, TC } from './header';

export class DNSEncoder {
  private buffer: Buffer;

  private offset = 0;

  private names: { name: string; offset: number; length: number }[] = [];

  constructor(private message: DNSMessage) {
    this.buffer = Buffer.alloc(512, 0, 'binary');
  }

  private encodeLabel(label: string): number {
    const { length } = label;

    if (length > 63) {
      throw new Error(`Invalid label length: ${label} (${length})`);
    }

    this.offset = this.buffer.writeUint8(length, this.offset);

    this.buffer.set(Buffer.from(label, 'ascii'), this.offset);

    this.offset += length;

    return length + 1; // +1 for length byte
  }

  private encodeDomain(domain: string): number {
    const labels = domain.toLowerCase().split('.');

    const startOffset = this.offset;

    if (this.offset !== 12) {
      const searchLabels = Array.from(labels);

      do {
        const search = searchLabels.join('.');

        const cachedName = this.names.find(({ name }) => name === search);

        if (cachedName) {
          const { length, offset } = cachedName;

          const pointer = 0xc000 | (offset - length);

          const end = labels.length - searchLabels.length;

          for (let i = 0; i < end; i++) {
            this.encodeLabel(labels[i]!);
          }

          this.offset = this.buffer.writeUint16BE(pointer, this.offset);

          return this.offset - startOffset;
        }

        searchLabels.splice(0, 1);
      } while (searchLabels.length);
    }

    if (!domain.endsWith('.')) {
      labels.push('');
    }

    labels.forEach((label) => this.encodeLabel(label));

    const cache = {
      name: domain.toLowerCase(),
      offset: this.offset,
      length: this.offset - startOffset,
    };

    this.names.push(cache);

    return cache.length;
  }

  private encodeHeader() {
    const { header } = this.message;

    const query = header.isQuery ? Query.QUERY : Query.RESPONSE;

    this.buffer.writeUInt16BE(header.id, 0);
    this.buffer.writeUInt16BE(
      query |
        header.opcode |
        (header.truncated ? TC : 0) |
        (header.authoritative ? AA : 0) |
        (header.recursionDesired ? RD : 0) |
        (header.recursionAvailable ? RA : 0) |
        header.responseCode,
      2
    );

    this.buffer.writeUInt16BE(header.qdcount, 4);
    this.buffer.writeUInt16BE(header.ancount, 6);
    this.buffer.writeUInt16BE(header.nscount, 8);
    this.offset = this.buffer.writeUInt16BE(header.arcount, 10);
  }

  private encodeQuestions() {
    const { questions } = this.message;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]!;
      this.offset += this.encodeDomain(question.qname);

      this.offset = this.buffer.writeUint16BE(question.qtype, this.offset);
      this.offset = this.buffer.writeUint16BE(question.qclass, this.offset);
    }
  }

  private encodeAnswer() {
    const { answer } = this.message;

    if (answer.length === 0) {
      return;
    }

    for (let i = 0; i < answer.length; i++) {
      const record = answer[i]!;

      const domainLength = this.encodeDomain(record.name);

      this.offset = this.buffer.writeUint16BE(record.type, this.offset);
      this.offset = this.buffer.writeUint16BE(record.cls, this.offset);
      this.offset = this.buffer.writeUint32BE(record.ttl, this.offset);
      this.offset = this.buffer.writeUint16BE(record.rdlength, this.offset);
      // TODO: We're missing the data

      /*
      /   1 octet for first label's length
      / + 1 octet for root label
      / + 2 octets for type field +
      / + 2 octets for class field +
      / + 4 octets for ttl
      / + 2 octets for rdlength field +
      / = 16 octets;
      */
      const rrLength = domainLength + 16 + record.rdlength; // TODO: This might not be correct
    }
  }

  encode(): Buffer {
    this.encodeHeader();
    this.encodeQuestions();
    this.encodeAnswer();

    return this.buffer.subarray(0, this.offset);
  }
}
