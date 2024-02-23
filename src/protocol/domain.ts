import { decodeLabel, encodeLabel } from './label';

export function encodeDomain(domain: string): Buffer {
  const { length } = domain;
  if (length > 253) {
    throw new Error(`Invalid domain length: ${domain} (${length})`);
  }

  const buff = Buffer.alloc(length + 2, 0, 'ascii');

  const endOffset = encodeDomainInto(domain, buff);

  return buff.subarray(0, endOffset);
}

export function encodeDomainInto(
  domain: string,
  buffer: Buffer,
  offset = 0
): number {
  const labels = domain.split('.');

  if (!domain.endsWith('.')) {
    labels.push('');
  }

  let index = offset;

  labels.forEach((label) => {
    const labelBuf = encodeLabel(label);
    buffer.set(labelBuf, index);
    index += labelBuf.length;
  });

  return index - offset;
}

export function decodeDomain(domain: Uint8Array): string {
  let labels: string[] = [];

  let index = 0;
  let length = domain[index];

  while (length && length !== 0) {
    const offset = index + length + 1;

    labels.push(decodeLabel(domain.slice(index, offset)));

    index += length + 1;
    length = domain[index];
  }

  return labels.join('.');
}

export function decodeDomainFrom(
  buffer: Uint8Array,
  offset = 0
): {
  domain: string;
  endOffset: number;
} {
  let labels: string[] = [];

  let index = offset;
  let length = buffer[index];

  while (length && length !== 0) {
    const offset = index + length + 1;

    labels.push(decodeLabel(buffer.slice(index, offset)));

    index += length + 1;
    length = buffer[index];
  }

  return {
    domain: labels.join('.'),
    endOffset: index,
  };
}
