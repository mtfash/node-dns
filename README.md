# Node.js DNS Protocol Implementation

This project is an implementation of DNS protocol in Node.js and Typescript for educational purposes. If you are interested in learning how DNS works or wondering how you can implement a DNS resolver, name server, or even a networking protocol in Node.js this is the right project for you to study.

## Create a DNS query packet

```javascript
const dnsMessageBuilder = new DNSMessageBuilder();

const dnsMessage = dnsMessageBuilder
  .withHeader(
    new DNSMessageHeader({
      id: 0x8739,
      isQuery: false,
      recursionDesired: true,
      recursionAvailable: true,
      qdcount: 1,
      ancount: 2,
    })
  )
  .withQuestions([
    new QuestionEntry({
      qname: 'gateway.instagram.com',
      qtype: QTYPE.A,
      qclass: QCLASS.IN,
    }),
  ])
  .withAnswer([
    new ResourceRecord({
      name: 'gateway.instagram.com',
      type: QTYPE.CNAME,
      cls: CLASS.IN,
      ttl: 2219,
      rdlength: 20,
      rdata: 'dgw.c10r.facebook.com',
    }),
    new ResourceRecord({
      name: 'dgw.c10r.facebook.com',
      type: QTYPE.A,
      cls: CLASS.IN,
      ttl: 40,
      rdlength: 4,
      rdata: '157.240.195.3',
    }),
  ])
  .build();

const encoder = new DNSEncoder(dnsMessage);
const buffer = encoder.encode();

console.log(buffer.toString('hex'));
```

## Tests

The best way to learn how to use this project is to study the tests. You can run the tests by running `npm run test`.

### References

1. https://www.rfc-editor.org/rfc/rfc1034
2. https://www.rfc-editor.org/rfc/rfc1035
