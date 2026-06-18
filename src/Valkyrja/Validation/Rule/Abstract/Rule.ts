/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
