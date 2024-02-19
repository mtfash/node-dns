import { Domain } from './protocol/domain';

const encodedDomain = Domain.encode('www.microsoft.com.');

console.log('encoded domain is', encodedDomain);

const decodedDomain = Domain.decode(encodedDomain);

console.log('decoded domain is', decodedDomain);
