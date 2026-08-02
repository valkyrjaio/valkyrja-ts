/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RuleContract } from '../../Rule/Contract/RuleContract.ts';

export interface ValidatorContract {
    validateRules(): boolean;
    setRules(rules: Record<string, RuleContract[]>): void;
    getErrorMessages(): Record<string, string>;
    hasFirstErrorMessage(): boolean;
    getFirstErrorMessage(): string;
}
