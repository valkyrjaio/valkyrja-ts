import { Rule } from '../Abstract/Rule.js';

export class NotEmpty extends Rule {
    isValid(): boolean {
        return this.subject !== '' && this.subject !== null && this.subject !== undefined;
    }
}
