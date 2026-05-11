import type { RuleContract } from '../../Rule/Contract/RuleContract.js';

export interface ValidatorContract {
    validateRules(): boolean;
    setRules(rules: Record<string, RuleContract[]>): void;
    getErrorMessages(): Record<string, string>;
    hasFirstErrorMessage(): boolean;
    getFirstErrorMessage(): string;
}
