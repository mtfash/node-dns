import { Label } from './protocol/label';

const label = Label.encode('www');

console.log(Label.decode(label));
console.log(label);
console.log(label.toString());
