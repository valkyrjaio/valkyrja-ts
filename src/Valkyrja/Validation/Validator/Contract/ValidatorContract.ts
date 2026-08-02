/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RuleContract } from '../../Rule/Contract/RuleContract.ts';

export interface ValidatorContract {
    validateRules(): boolean;
    setRules(rules: Record<string, RuleContract[]>): void;
    getErrorMessages(): Record<string, string>;
    hasFirstErrorMessage(): boolean;
    getFirstErrorMessage(): string;
}
