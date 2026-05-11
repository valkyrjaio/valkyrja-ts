import { ValidationRuleFailureException } from '../Throwable/Exception/ValidationRuleFailureException.js';
import type { RuleContract } from '../Rule/Contract/RuleContract.js';
import type { ValidatorContract } from './Contract/ValidatorContract.js';

export class Validator implements ValidatorContract {
    protected errorMessages: Record<string, string> = {};

    constructor(protected rules: Record<string, RuleContract[]> = {}) {}

    validateRules(): boolean {
        for (const [subject, subjectRules] of Object.entries(this.rules)) {
            for (const rule of subjectRules) {
                this.validateRule(rule, subject);
            }
        }

        return Object.keys(this.errorMessages).length === 0;
    }

    setRules(rules: Record<string, RuleContract[]>): void {
        this.rules = rules;
    }

    getErrorMessages(): Record<string, string> {
        return this.errorMessages;
    }

    hasFirstErrorMessage(): boolean {
        return Object.keys(this.errorMessages).length > 0;
    }

    getFirstErrorMessage(): string {
        const keys = Object.keys(this.errorMessages);

        return keys.length > 0 ? this.errorMessages[keys[0]!]! : '';
    }

    protected validateRule(rule: RuleContract, subject: string): void {
        try {
            rule.validate();
        } catch (e) {
            if (e instanceof ValidationRuleFailureException) {
                this.errorMessages[subject] = `${subject}: ${e.message}`;
            }
        }
    }
}
