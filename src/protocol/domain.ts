import { DataFormatError } from '../error/data-error';

export class Domain {
  private labels: string[];

  constructor(domain: string) {
    if (domain.length > 253) {
      throw new DataFormatError(
        `Invalid domain length: ${domain} (${domain.length})`
      );
    }
    const labels = domain.split('.');
    labels.forEach((label) => {});

    this.labels = labels;
  }

  encode(): Uint8Array {
    const arr = new Uint8Array(
      (function* () {
        yield* [1, 2, 3];
      })()
    );

    return arr;
  }
}
