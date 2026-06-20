/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValidationRuleFailureException } from '../Throwable/Exception/ValidationRuleFailureException.ts';
import type { RuleContract } from '../Rule/Contract/RuleContract.ts';
import type { ValidatorContract } from './Contract/ValidatorContract.ts';

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
        return Object.values(this.errorMessages)[0] ?? '';
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
