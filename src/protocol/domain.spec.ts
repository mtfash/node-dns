import { Domain } from './domain';

describe('Domain::encode', () => {
  it('should correctly encode label string to an array of octets', () => {
    const domain = 'www.microsoft.com';
    const buffer = Domain.encode(domain);

    expect(buffer.byteLength).toBe(19);
    expect(buffer[0]).toBe(3);
    expect(buffer[18]).toBe(0);
    expect(buffer[4]).toBe(9);
  });

  it('should correctly encode label strings with last dot to an array of octets', () => {
    const domain = 'www.microsoft.com.';
    const buffer = Domain.encode(domain);

    expect(buffer.byteLength).toBe(19);
    expect(buffer[0]).toBe(3);
    expect(buffer[4]).toBe(9);
    expect(buffer[18]).toBe(0);
  });
});
