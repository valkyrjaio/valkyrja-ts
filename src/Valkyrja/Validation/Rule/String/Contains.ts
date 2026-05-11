import { Rule } from '../Abstract/Rule.js';

export class Contains extends Rule {
    constructor(subject: unknown, protected readonly needle: string, errorMessage: string) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject.includes(this.needle);
    }
}