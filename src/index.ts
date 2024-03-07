import dgram from 'dgram';
import { DNSMessageBuilder } from './protocol/dns-message-builder';
import { DNSMessageHeader } from './protocol/header';
import { QuestionEntry } from './protocol/question';
import { DNSEncoder } from './protocol/dns-encoder';
import { QCLASS } from './values/qclass';
import { QTYPE } from './values/qtype';

// Looking up www.instagram.com from google's name servers

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
      qtype: QTYPE.A,
    }),
  ])
  .build();

const encoder = new DNSEncoder(message);
const buffer = encoder.encode();

const client = dgram.createSocket('udp4');

client.on('listening', () => {
  const address = client.address();
  console.log(`listening on ${address.address}:${address.port}`);
});

client.on('message', (message, rinfo) => {
  const hex = message.toString('hex');
  console.log(`response: ${hex}`);
  process.exit(0);
});

client.send(buffer, 53, '8.8.8.8', (err, bytes) => {
  if (err) throw err;

  console.log(
    `query packet: ${buffer.toString('hex')} packet length: ${bytes}`
  );
});

// 0001818000010002000000000377777709696e7374616772616d03636f6d0000010001c00c0005000100000dea00170f7a2d7034322d696e7374616772616d0463313072c010c02f000100010000003400049df00dae
// 0001818000010002000000000377777709696e7374616772616d03636f6d0000010001c00c0005000100000dea00170f7a2d7034322d696e7374616772616d0463313072c010c02f000100010000003400049df00dae
