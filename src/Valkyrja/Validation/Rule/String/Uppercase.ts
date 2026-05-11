import { Rule } from '../Abstract/Rule.js';

export class Uppercase extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject === this.subject.toUpperCase();
    }
}