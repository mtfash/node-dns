import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';
import { decodeQuestion, encodeQuestion } from './question';

const entries: { question: Buffer; base64: string }[] = [
  {
    question: encodeQuestion({
      qname: 'gs-loc-new.ls-apple.com.akadns.net',
      qtype: QTYPE.HTTPS,
      qclass: QCLASS.IN,
    }),
    base64: 'CmdzLWxvYy1uZXcIbHMtYXBwbGUDY29tBmFrYWRucwNuZXQAAEEAAQ==',
  },
  {
    question: encodeQuestion({
      qname: 'gs-loc-new.ls-apple.com.akadns.net',
      qtype: QTYPE.A,
      qclass: QCLASS.IN,
    }),
    base64: 'CmdzLWxvYy1uZXcIbHMtYXBwbGUDY29tBmFrYWRucwNuZXQAAAEAAQ==',
  },
  {
    question: encodeQuestion({
      qname: 'mobile.events.data.microsoft.com',
      qtype: QTYPE.AAAA,
      qclass: QCLASS.IN,
    }),
    base64: 'Bm1vYmlsZQZldmVudHMEZGF0YQltaWNyb3NvZnQDY29tAAAcAAE=',
  },
];

describe('Questions', () => {
  describe('encodeQuestion()', () => {
    it('should correctly encode question entry to octect array', () => {
      entries.forEach(({ question, base64 }) => {
        expect(question.toString('base64')).toBe(base64);
      });
    });
  });

  describe('decodeQuestion()', () => {
    it('should correctly decode question buffer to question object', () => {
      const questionBuff = Buffer.from([
        0x0a, 0x67, 0x73, 0x2d, 0x6c, 0x6f, 0x63, 0x2d, 0x6e, 0x65, 0x77, 0x08,
        0x6c, 0x73, 0x2d, 0x61, 0x70, 0x70, 0x6c, 0x65, 0x03, 0x63, 0x6f, 0x6d,
        0x06, 0x61, 0x6b, 0x61, 0x64, 0x6e, 0x73, 0x03, 0x6e, 0x65, 0x74, 0x00,
        0x00, 0x41, 0x00, 0x01,
      ]);

      const question = decodeQuestion(questionBuff);
      expect(question).toBeDefined();
      expect(question.qname).toBe('gs-loc-new.ls-apple.com.akadns.net');
      expect(question.qtype).toBe(QTYPE.HTTPS);
      expect(question.qclass).toBe(QCLASS.IN);
    });
  });
});
