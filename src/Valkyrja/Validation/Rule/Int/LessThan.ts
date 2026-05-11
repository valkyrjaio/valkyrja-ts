import { Rule } from '../Abstract/Rule.js';

export class LessThan extends Rule {
    constructor(subject: unknown, protected readonly max: number, errorMessage: string) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'number' && this.subject < this.max;
    }
}
