import { ValidationRuleFailureException } from '../../Throwable/Exception/ValidationRuleFailureException.js';
import type { RuleContract } from '../Contract/RuleContract.js';

export abstract class Rule implements RuleContract {
    constructor(
        protected subject: unknown,
        protected errorMessage: string,
    ) {}

    getSubject(): unknown {
        return this.subject;
    }

    abstract isValid(): boolean;

    validate(): void {
        if (!this.isValid()) {
            throw new ValidationRuleFailureException(this.errorMessage);
        }
    }
}
