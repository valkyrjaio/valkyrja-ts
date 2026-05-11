import { Rule } from '../Abstract/Rule.js';

export class Regex extends Rule {
    constructor(subject: unknown, protected readonly regex: string, errorMessage: string) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'string'
            && this.subject !== ''
            && new RegExp(this.regex).test(this.subject);
    }
}
