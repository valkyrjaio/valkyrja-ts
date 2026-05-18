import { Rule } from '../Abstract/Rule.js';

export class Max extends Rule {
    constructor(
        subject: unknown,
        protected readonly max: number,
        errorMessage: string,
    ) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return typeof this.subject === 'string' && this.subject.length <= this.max;
    }
}
