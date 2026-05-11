import { Rule } from '../Abstract/Rule.js';

export class IsString extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string';
    }
}
