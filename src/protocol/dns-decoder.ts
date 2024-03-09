import { CLASS } from '../values/class';
import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';
import { DNSMessage } from './dns-message';
import { DNSMessageBuilder } from './dns-message-builder';
import * as header from './header';
import { QuestionEntry } from './question';
import { ResourceRecord } from './resource-record';

type RDataDecoder = (data: Buffer, decoder: DNSDecoder) => any;

export class DNSDecoder {
  private names: { name: string; offset: number }[] = [];

  private builder: DNSMessageBuilder = new DNSMessageBuilder();

  private offset = 0;
  private qdcount = 0;
  private ancount = 0;
  private nscount = 0;
  private arcount = 0;

  private static RDataDecoders: {
    [key: number]: RDataDecoder;
  } = {
    [QTYPE.CNAME]: (data: Buffer, that: DNSDecoder) => {
      return that.decodeDomain();
    },
    [QTYPE.A]: (data: Buffer, that: DNSDecoder) => {},
  };

  constructor(private message: Buffer) {}

  decodeHeader() {
    const num32Bits = this.message.readUInt32BE();

    let opcode = header.Opcode.QUERY;
    if ((num32Bits & header.Opcode.IQUERY) === header.Opcode.IQUERY) {
      opcode = header.Opcode.IQUERY;
    } else if ((num32Bits & header.Opcode.STATUS) === header.Opcode.STATUS) {
      opcode = header.Opcode.STATUS;
    } else if ((num32Bits ^ header.OPCODE_MASK) === header.OPCODE_MASK) {
      opcode = header.Opcode.QUERY;
    }
    let rc = header.ResponseCode.NoError;
    if ((num32Bits ^ header.RCODE_MASK) === header.RCODE_MASK) {
      rc = header.ResponseCode.NoError;
    } else if ((num32Bits & header.RCODE_1) === header.RCODE_1) {
      rc = header.ResponseCode.FormatError;
    } else if ((num32Bits & header.RCODE_2) === header.RCODE_2) {
      rc = header.ResponseCode.ServerFailure;
    } else if ((num32Bits & header.RCODE_3) === header.RCODE_3) {
      rc = header.ResponseCode.NameError;
    } else if ((num32Bits & header.RCODE_4) === header.RCODE_4) {
      rc = header.ResponseCode.NotImplemented;
    } else if ((num32Bits & header.RCODE_5) === header.RCODE_5) {
      rc = header.ResponseCode.Refused;
    }

    const id = this.message.readUInt16BE(0);
    const isQuery = (num32Bits & header.QRY_RESPONSE) === 0;

    const authoritative = !!(num32Bits & header.AA);
    const truncated = !!(num32Bits & header.TC);
    const recursionDesired = !!(num32Bits & header.RD);
    const recursionAvailable = !!(num32Bits & header.RA);
    const responseCode = rc;

    this.qdcount = this.message.readUint16BE(4);
    this.ancount = this.message.readUint16BE(6);
    this.nscount = this.message.readUint16BE(8);
    this.arcount = this.message.readUint16BE(10);

    this.builder.withHeader(
      new header.DNSMessageHeader({
        id,
        isQuery,
        opcode,
        responseCode,
        authoritative,
        truncated,
        recursionAvailable,
        recursionDesired,
        qdcount: this.qdcount,
        ancount: this.ancount,
        nscount: this.nscount,
        arcount: this.arcount,
      })
    );

    this.offset = 12;
  }

  decodeDomain(): string {
    let labels: string[] = [];
    let length = this.message.readUInt8(this.offset);

    const offsets: number[] = [];

    const startOffset = this.offset;

    while (length && length !== 0) {
      this.offset += 1;

      if ((length & 0xc0) === 0xc0) {
        const pointer = this.message.readUInt16BE(this.offset - 1) & 0x3fff;
        const domain = this.names.find(({ offset }) => offset === pointer);

        if (!domain) {
          throw new Error(`Invalid pointer ${pointer}`);
        }

        this.offset += 1;

        if (labels.length === 0) {
          return domain.name;
        }

        labels.push(domain.name);

        const name = labels.join('.');

        this.names.push({ offset: startOffset, name: name });

        return name;
      } else {
        labels.push(
          this.message
            .subarray(this.offset, this.offset + length)
            .toString('ascii')
        );

        offsets.push(this.offset - 1);

        this.offset += length;

        length = this.message.readUint8(this.offset);
      }
    }

    this.offset += 1;

    offsets.forEach((offset, index) => {
      this.names.push({ offset, name: labels.slice(index).join('.') });
    });

    return labels.join('.');
  }

  decodeQuestions() {
    const questions: QuestionEntry[] = [];

    for (let i = 0; i < this.qdcount; i++) {
      const qname = this.decodeDomain();

      const qtype: QTYPE = this.message.readUInt16BE(this.offset);
      this.offset += 2;

      const qclass: QCLASS = this.message.readUInt16BE(this.offset);
      this.offset += 2;

      questions.push(
        new QuestionEntry({
          qname,
          qtype,
          qclass,
        })
      );
    }

    this.builder.withQuestions(questions);
  }

  decodeAnswers() {
    const answers: ResourceRecord[] = [];

    for (let i = 0; i < this.ancount; i++) {
      const name = this.decodeDomain();

      const type: QTYPE = this.message.readUInt16BE(this.offset);
      this.offset += 2;

      const cls: CLASS = this.message.readUInt16BE(this.offset);
      this.offset += 2;

      const ttl: number = this.message.readUInt32BE(this.offset);
      this.offset += 4;

      const rdlength: number = this.message.readUInt16BE(this.offset);
      this.offset += 2;

      const data: Buffer = this.message.subarray(
        this.offset,
        this.offset + rdlength
      );

      const rdataDecoder = DNSDecoder.RDataDecoders[type];
      if (!rdataDecoder) {
        throw new Error(`Resource record of type ${type} is not supported`);
      }

      answers.push(
        new ResourceRecord({
          name,
          type,
          cls,
          ttl,
          rdlength,
          rdata: rdataDecoder(data, this),
        })
      );
    }

    this.builder.withAnswers(answers);
  }

  decode(): DNSMessage {
    this.decodeHeader();
    this.decodeQuestions();
    this.decodeAnswers();

    return this.builder.build();
  }
}
