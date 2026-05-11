import { Rule } from '../Abstract/Rule.js';

export class GreaterThan extends Rule {
    constructor(subject: unknown, protected readonly min: number, errorMessage: string) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'number' && this.subject > this.min;
    }
}
