import { Label } from './label';

export class Domain {
  static encode(domain: string): Buffer {
    if (domain.length > 253) {
      throw new Error(`Invalid domain length: ${domain} (${domain.length})`);
    }

    const labels = domain.split('.');

    const hasLastDot = domain.endsWith('.');

    if (!hasLastDot) {
      labels.push('');
    }

    const extraLength = hasLastDot ? 1 : 2;
    const domainBuf = Buffer.alloc(domain.length + extraLength, 0, 'ascii');

    let index = 0;
    labels.forEach((label) => {
      const labelBuf = Label.encode(label);
      domainBuf.set(labelBuf, index);
      index += labelBuf.length;
    });

    return domainBuf;
  }
}
