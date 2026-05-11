import { Rule } from '../Abstract/Rule.js';

export class IsBool extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'boolean';
    }
}
