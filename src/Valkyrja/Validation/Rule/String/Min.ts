import { Rule } from '../Abstract/Rule.js';

export class Min extends Rule {
    constructor(subject: unknown, protected readonly min: number, errorMessage: string) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject.length >= this.min;
    }
}