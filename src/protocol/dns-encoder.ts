import { QTYPE } from '../values/qtype';
import { DNSMessage } from './dns-message';
import { AA, Query, RA, RD, TC } from './header';

type RDataEncoder = (arg: string, encoder: DNSEncoder) => number;

export class DNSEncoder {
  private buffer: Buffer;

  private offset = 0;

  private names: { name: string; offset: number }[] = [];

  private static RDataEncoders: {
    [key: number]: RDataEncoder;
  } = {
    [QTYPE.CNAME]: (domain: string, that: DNSEncoder): number => {
      return that.encodeDomain(domain);
    },
    [QTYPE.A]: (ipv4: string, that: DNSEncoder): number => {
      ipv4.split('.').forEach((field) => {
        that.offset = that.buffer.writeUint8(parseInt(field), that.offset);
      });

      return that.offset;
    },
    [QTYPE.AAAA]: (ipv6: string, that: DNSEncoder): number => {
      const groups = ipv6.split(':');

      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group) {
          const iGrp = parseInt(group, 16);
          that.offset = that.buffer.writeUInt16BE(iGrp, that.offset);
        } else {
          const removedGroups = 8 - groups.length;

          for (let j = 0; j < removedGroups; j++) {
            console.log(i, j, i);
            that.offset = that.buffer.writeUInt16BE(0, that.offset);
          }
        }
      }
      return that.offset;
    },
  };

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

    if (this.offset !== 12) {
      const searchLabels = Array.from(labels);

      do {
        const search = searchLabels.join('.');

        const cachedName = this.names.find(({ name }) => name === search);

        if (cachedName) {
          const pointer = 0xc000 | cachedName.offset;

          const end = labels.length - searchLabels.length;

          for (let i = 0; i < end; i++) {
            this.names.push({
              name: labels.slice(i).join('.'),
              offset: this.offset,
            });

            this.encodeLabel(labels[i]!);
          }

          this.offset = this.buffer.writeUint16BE(pointer, this.offset);

          return this.offset;
        }

        searchLabels.splice(0, 1);
      } while (searchLabels.length);
    }

    labels.forEach((label, index) => {
      this.names.push({
        name: labels.slice(index).join('.'),
        offset: this.offset,
      });

      this.encodeLabel(label);
    });

    if (!domain.endsWith('.')) {
      this.encodeLabel('');
    }

    return this.offset;
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
      this.offset = this.encodeDomain(question.qname);

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

      this.encodeDomain(record.name);

      this.offset = this.buffer.writeUint16BE(record.type, this.offset);
      this.offset = this.buffer.writeUint16BE(record.cls, this.offset);
      this.offset = this.buffer.writeUint32BE(record.ttl, this.offset);
      this.offset = this.buffer.writeUint16BE(record.rdlength, this.offset);

      const rdataEncoder = DNSEncoder.RDataEncoders[record.type];

      if (!rdataEncoder) {
        throw new Error(`Resource records ${record.type} is not supported`);
      }

      this.offset = rdataEncoder(record.rdata, this);
    }
  }

  encode(): Buffer {
    this.encodeHeader();
    this.encodeQuestions();
    this.encodeAnswer();

    return this.buffer.subarray(0, this.offset);
  }
}
