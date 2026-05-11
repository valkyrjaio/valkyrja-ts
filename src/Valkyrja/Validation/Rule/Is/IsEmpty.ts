import { Rule } from '../Abstract/Rule.js';

export class IsEmpty extends Rule {
    isValid(): boolean {
        return this.subject === '' || this.subject === null || this.subject === undefined;
    }
}
