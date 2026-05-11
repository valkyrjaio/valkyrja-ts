import { Rule } from '../Abstract/Rule.js';

export class Required extends Rule {
    isValid(): boolean {
        return !!this.subject;
    }
}