import { QCLASS } from '../values/qclass';
import { QTYPE } from '../values/qtype';
import { encodeQuestion } from './question';

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
});
