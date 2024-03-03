# Node.js DNS Protocol Implementation

This project is an implementation of DNS protocol in Node.js and Typescript for educational purposes. If you are interested in learning how DNS works or wondering how you can implement a DNS resolver, name server, or even a networking protocol in Node.js this is the right project for you to study.

## Create a DNS query packet

    const dnsMessageBuilder = new DNSMessageBuilder();

    const dnsMessage = dnsMessageBuilder
      .withHeader(
        new DNSMessageHeader({
          id: 0xa379,
          recursionDesired: true,
          qdcount: 2,
        })
      )
      .withQuestions([
        new QuestionEntry({
          qname: 'contacts.google.com',
          qtype: QTYPE.AAAA,
          qclass: QCLASS.IN,
        }),
        new QuestionEntry({
          qname: 'www.microsoft.com',
          qtype: QTYPE.AAAA,
          qclass: QCLASS.IN,
        }),
      ])
      .build();

    const encoder = new DNSEncoder(dnsMessage);
    const buffer = encoder.encode();

    console.log(buffer.toString('hex'));
    // output: a3790100000200000000000008636f6e746163747306676f6f676c6503636f6d00001c000103777777096d6963726f736f667403636f6d00001c0001

## Tests

The best way to learn how to use this project is to study the tests. You can run the tests by running `npm run test`.
