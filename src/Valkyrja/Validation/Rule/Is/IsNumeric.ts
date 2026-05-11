import { Rule } from '../Abstract/Rule.js';

export class IsNumeric extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'number' || (typeof this.subject === 'string' && !isNaN(Number(this.subject)));
    }
}
