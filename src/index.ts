import { MessageHeader, Opcode, Query, ResponseCode } from "./message/header";

const header = new MessageHeader({
	id: 3,
	query: Query.RESPONSE,
	authoritativeAnswer: true,
	opcode: Opcode.IQUERY,
	recursionDesired: true,
	responseCode: ResponseCode.Refused,
	truncated: false,
	recursionAvailable: true,
});

console.log(`${header}`);
