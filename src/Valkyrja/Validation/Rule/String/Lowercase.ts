import { Rule } from '../Abstract/Rule.js';

export class Lowercase extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject === this.subject.toLowerCase();
    }
}
