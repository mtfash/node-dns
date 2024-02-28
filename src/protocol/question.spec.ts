import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';
import { QuestionEntry } from './question';

const encodeEntries: { question: QuestionEntry; base64: string }[] = [
  {
    question: new QuestionEntry({
      qname: 'gs-loc-new.ls-apple.com.akadns.net',
      qtype: QTYPE.HTTPS,
      qclass: QCLASS.IN,
    }),
    base64: 'CmdzLWxvYy1uZXcIbHMtYXBwbGUDY29tBmFrYWRucwNuZXQAAEEAAQ==',
  },
  {
    question: new QuestionEntry({
      qname: 'gs-loc-new.ls-apple.com.akadns.net',
      qtype: QTYPE.A,
      qclass: QCLASS.IN,
    }),
    base64: 'CmdzLWxvYy1uZXcIbHMtYXBwbGUDY29tBmFrYWRucwNuZXQAAAEAAQ==',
  },
  {
    question: new QuestionEntry({
      qname: 'mobile.events.data.microsoft.com',
      qtype: QTYPE.AAAA,
      qclass: QCLASS.IN,
    }),
    base64: 'Bm1vYmlsZQZldmVudHMEZGF0YQltaWNyb3NvZnQDY29tAAAcAAE=',
  },
];

const decodeEntries: { buffer: Buffer; expected: QuestionEntry }[] = [
  {
    buffer: Buffer.from([
      0x09, 0x61, 0x70, 0x72, 0x65, 0x73, 0x6f, 0x6c, 0x76, 0x65, 0x07, 0x73,
      0x70, 0x6f, 0x74, 0x69, 0x66, 0x79, 0x03, 0x63, 0x6f, 0x6d, 0x00, 0x00,
      0x01, 0x00, 0x01,
    ]),
    expected: new QuestionEntry({
      qname: 'apresolve.spotify.com',
      qtype: QTYPE.A,
      qclass: QCLASS.IN,
    }),
  },
  {
    buffer: Buffer.from([
      0x0a, 0x67, 0x73, 0x2d, 0x6c, 0x6f, 0x63, 0x2d, 0x6e, 0x65, 0x77, 0x08,
      0x6c, 0x73, 0x2d, 0x61, 0x70, 0x70, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d,
      0x06, 0x61, 0x6b, 0x61, 0x64, 0x6e, 0x73, 0x03, 0x6e, 0x65, 0x74, 0x00,
      0x00, 0x41, 0x00, 0x01,
    ]),
    expected: new QuestionEntry({
      qname: 'gs-loc-new.ls-apple.com.akadns.net',
      qtype: QTYPE.HTTPS,
      qclass: QCLASS.IN,
    }),
  },
];

describe('Questions', () => {
  describe('encode()', () => {
    it('should correctly encode question entry to octect array', () => {
      encodeEntries.forEach(({ question, base64 }) => {
        expect(question.encode().toString('base64')).toBe(base64);
      });
    });
  });

  describe('constructor(Buffer)', () => {
    it('should correctly decode question buffer to question object', () => {
      decodeEntries.forEach(({ buffer, expected }) => {
        const question = new QuestionEntry(buffer);
        expect(question).toBeDefined();
        expect(question.qname).toBe(expected.qname);
        expect(question.qtype).toBe(expected.qtype);
        expect(question.qclass).toBe(expected.qclass);
      });
    });
  });
});
