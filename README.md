# Node.js DNS Protocol Implementation

This project is an implementation of DNS protocol in Node.js and Typescript for educational purposes. If you are interested in learning how DNS works or wondering how you can implement a DNS resolver, name server, or even a networking protocol in Node.js this is the right project for you to study.

## Looking up `www.instagram.com` from Google's public DNS

This example shows how to create a DNS query for `www.instagram.com` and send it to Google's public DNS servers.

```javascript
async function lookup(query: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket('udp4');

    client.on('error', reject);

    client.on('message', (message) => {
      client.close();
      return resolve(message);
    });

    client.on('listening', () => {
      const address = client.address();

      console.log(`Listening on ${address.address}:${address.port}`);

      client.send(query, 53, '8.8.8.8', (err, bytes) => {
        if (err) {
          return reject(err);
        }

        console.log(`Sent ${bytes} bytes to 8.8.8.8:53`);
      });
    });

    client.bind();
  });
}

async function main() {
  const builder = new DNSMessageBuilder();
  const message = builder
    .withHeader(
      new DNSMessageHeader({
        id: 0x01,
        isQuery: true,
        recursionDesired: true,
      })
    )
    .withQuestions([
      new QuestionEntry({
        qname: 'www.instagram.com',
        qclass: QCLASS.IN,
        qtype: QTYPE.AAAA,
      }),
    ])
    .build();

  const encoder = new DNSEncoder(message);
  const buffer = encoder.encode();
  const responseBuffer = await lookup(buffer);

  const decoder = new DNSDecoder(responseBuffer);

  const responseMessage = decoder.decode();
  console.log('Response:', responseMessage);
}

main();
```

## Tests

The best way to learn how to use this project is to study the tests. You can run the tests by running `npm run test`.

### References

1. https://www.rfc-editor.org/rfc/rfc1034
2. https://www.rfc-editor.org/rfc/rfc1035
