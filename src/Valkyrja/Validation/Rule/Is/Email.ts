import { Rule } from '../Abstract/Rule.js';

export class Email extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string'
            && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.subject);
    }
}
