import { Rule } from '../Abstract/Rule.js';

export class Alpha extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string' && /^[a-zA-Z]+$/.test(this.subject);
    }
}
