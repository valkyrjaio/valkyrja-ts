import { Rule } from '../Abstract/Rule.js';

export class NotEqual extends Rule {
    constructor(subject: unknown, protected readonly value: unknown, errorMessage: string) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return this.subject !== this.value;
    }
}
