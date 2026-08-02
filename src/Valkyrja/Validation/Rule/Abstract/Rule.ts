/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ValidationRuleFailureException } from '../../Throwable/Exception/ValidationRuleFailureException.ts';
import type { RuleContract } from '../Contract/RuleContract.ts';

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
