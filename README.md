# Node.js DNS Protocol Implementation

This project is an implementation of DNS protocol in Node.js and Typescript for educational purposes. If you are interested in learning how DNS works or wondering how you can implement a DNS resolver, name server, or even a networking protocol in Node.js this is the right project for you to study.

## Create a DNS query packet

```javascript
const dnsMessage = dnsMessageBuilder
  .withHeader(
    new DNSMessageHeader({
      id: 0x6d52,
      isQuery: false,
      recursionDesired: true,
      recursionAvailable: true,
      qdcount: 1,
      ancount: 1,
    })
  )
  .withQuestions([
    new QuestionEntry({
      qname: 'signaler-pa.clients6.google.com',
      qtype: QTYPE.AAAA,
      qclass: QCLASS.IN,
    }),
  ])
  .withAnswer([
    new ResourceRecord({
      name: 'signaler-pa.clients6.google.com',
      type: QTYPE.AAAA,
      cls: CLASS.IN,
      ttl: 46,
      rdlength: 16,
      rdata: '2a00:1450:4019:802::200a',
    }),
  ])
  .build();

const encoder = new DNSEncoder(dnsMessage);
const buffer = encoder.encode();

console.log(buffer.toString('hex'));
// output:   6d52818000010001000000000b7369676e616c65722d706108636c69656e74733606676f6f676c6503636f6d00001c0001c00c001c00010000002e0010
```
## Tests

The best way to learn how to use this project is to study the tests. You can run the tests by running `npm run test`.


### References

1. https://www.rfc-editor.org/rfc/rfc1034
2. https://www.rfc-editor.org/rfc/rfc1035
