import dgram from 'dgram';
import { DNSMessageBuilder } from './protocol/dns-message-builder';
import { DNSMessageHeader } from './protocol/header';
import { QuestionEntry } from './protocol/question';
import { DNSEncoder } from './protocol/dns-encoder';
import { QCLASS } from './values/qclass';
import { QTYPE } from './values/qtype';
import { DNSDecoder } from './protocol/dns-decoder';

async function lookup(query: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket('udp4');

    client.on('listening', () => {
      const address = client.address();
      console.log(`listening on ${address.address}:${address.port}`);
    });

    client.on('message', (message) => {
      client.close();
      return resolve(message);
    });

    client.on('error', reject);

    client.send(query, 53, '8.8.8.8', (err, bytes) => {
      if (err) {
        return reject(err);
      }
      console.log(
        `query packet: ${query.toString('hex')} packet length: ${bytes}`
      );
    });
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
        qdcount: 1,
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

  console.log(responseBuffer.toString('hex'));
  const decoder = new DNSDecoder(responseBuffer);

  try {
    const responseMessage = decoder.decode();
    console.log(responseMessage);
  } catch (err: any) {
    console.log(err.message);
  }
}
main();
