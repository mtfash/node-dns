import { DNSMessage } from './dns-message';
import { AA, Query, RA, RD, TC } from './header';

export class DNSEncoder {
  private buffer: Buffer;
  private __Q_OFFSETS: { offset: number; length: number }[] = [];
  private __A_OFFSETS: { offset: number; length: number }[] = [];

  private endOffset = 0;

  constructor(private message: DNSMessage) {
    this.buffer = Buffer.alloc(512, 0, 'binary');
  }

  private encodeLabel(label: string, offset: number): number {
    const { length } = label;

    if (length > 63) {
      throw new Error(`Invalid label length: ${label} (${length})`);
    }

    this.buffer.writeUint8(length, offset);
    this.buffer.set(Buffer.from(label, 'ascii'), offset + 1);

    return length + 1; // label length + 1 byte length byte
  }

  private encodeDomain(domain: string, offset: number): number {
    const labels = domain.toLowerCase().split('.');

    if (offset !== 12) {
      const searchLabels = Array.from(labels);

      do {
        const search = searchLabels.join('.');

        const index = this.message.questions.findIndex(
          (q) => q.qname.toLowerCase() === search
        );

        if (index !== -1) {
          const { length, offset } = this.__Q_OFFSETS[index]!;
          const pointer = 0xc000 | (offset - length);

          const end = labels.length - searchLabels.length;

          let endOffset = offset;
          for (let i = 0; i < end; i++) {
            endOffset += this.encodeLabel(labels[i]!, endOffset);
          }

          return this.buffer.writeUint16BE(pointer, endOffset) - offset;
        }

        searchLabels.splice(0, 1);
      } while (searchLabels.length);
    }

    if (!domain.endsWith('.')) {
      labels.push('');
    }

    let endOffset = offset;

    labels.forEach(
      (label) => (endOffset += this.encodeLabel(label, endOffset))
    );

    return endOffset - offset; // domain length
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
    this.endOffset = 12;
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

      if (i === 0) {
        this.__Q_OFFSETS.push({ offset, length: offset - 12 });
      } else {
        const previous = this.__Q_OFFSETS[i - 1]!.offset;
        this.__Q_OFFSETS.push({ offset, length: offset - previous });
      }

      this.endOffset = offset;
    }
  }

  private encodeAnswer() {
    const { answer } = this.message;

    if (answer.length === 0) {
      return;
    }

    let offset = this.__Q_OFFSETS[this.__Q_OFFSETS.length - 1]!.offset;

    for (let i = 0; i < answer.length; i++) {
      const record = answer[i]!;

      const domainLength = this.encodeDomain(record.name, offset);

      offset += domainLength;

      this.buffer.writeUint16BE(record.type, offset);
      this.buffer.writeUint16BE(record.cls, offset + 2);
      this.buffer.writeUint32BE(record.ttl, offset + 4);
      this.endOffset = this.buffer.writeUint16BE(record.rdlength, offset + 8);
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

      this.__A_OFFSETS.push({ length: rrLength, offset: this.endOffset }); // TODO: This is not correct
    }
  }

  encode(): Buffer {
    this.encodeHeader();
    this.encodeQuestions();
    this.encodeAnswer();

    return this.buffer.subarray(0, this.endOffset);
  }
}
