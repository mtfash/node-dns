export class Label extends Buffer {
  static encode(label: string): Label {
    const { length } = label;
    if (length > 63) {
      throw new Error(`Invalid label length: ${label} (${length})`);
    }

    const buffer = Buffer.alloc(length + 1, 0, 'ascii');

    buffer.writeUint8(length, 0);
    buffer.set(Buffer.from(label, 'ascii'), 1);

    return Label.from(buffer);
  }

  static decode(array: Uint8Array): string {
    const length = array[0];
    const label = array.slice(1);

    if (label.length !== length) {
      throw new Error(
        `Invalid label array input: length octet does not match label's length`
      );
    }

    return new TextDecoder().decode(label);
  }

  toString() {
    return this.subarray(1).toString();
  }
}
