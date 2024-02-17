export enum QTYPE {
  A = 1, // A host address
  NS = 2, // An authoritative name server
  MD = 3, // A mail destination (Obsolete)
  MF = 4, // A mail forwarder (Obsolete)
  CNAME = 5, // the canonical name for an alias
  SOA = 6, // marks the start of a zone of authority
  MB = 7, // a mailbox domain name
  MG = 8, // a mail group member
  MR = 9, // a mail rename domain name
  NULL = 10, // a null RR
  WKS = 11, // a well known service description
  PTR = 12, // a domain name pointer
  HINFO = 13, // host information
  MINFO = 14, // mailbox or mail list information
  MX = 15, // mail exchange
  TXT = 16, // text strings
  AXFR = 252, // A request for a transfer of an entire zone
  MAILB = 253, // A request for mailbox-related records (MB, MG or MR)
  MAILA = 254, // A request for mail agent RRs (Obsolete - see MX)
  $ALL = 255, // A request for all records
}
