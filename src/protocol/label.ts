export class Label {
  static encode(label: string): Buffer {
    const { length } = label;
    if (length > 63) {
      throw new Error(`Invalid label length: ${label} (${length})`);
    }

    const buffer = Buffer.alloc(length + 1, 0, 'ascii');

    buffer.writeUint8(length, 0);
    buffer.set(Buffer.from(label, 'ascii'), 1);

    return Buffer.from(buffer);
  }

  static decode(array: Uint8Array): string {
    if (typeof array[0] === 'undefined') {
      throw new Error('Invalid label array input: length octet is undefined');
    }

    if (array.length !== array[0] + 1) {
      throw new Error(
        `Invalid label array input: length octet does not match label's length`
      );
    }

    return Buffer.from(array.slice(1)).toString('ascii');
  }
}
