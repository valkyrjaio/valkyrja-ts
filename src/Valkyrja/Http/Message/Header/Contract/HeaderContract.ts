/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ValueContract } from '../Value/Contract/ValueContract.js';

export interface HeaderContract {
    getName(): string;
    getNormalizedName(): string;
    withName(name: string): this;
    getValues(): Array<ValueContract | string>;
    withValues(...values: Array<ValueContract | string>): this;
    withAddedValues(...values: Array<ValueContract | string>): this;
    getHeaderLine(): string;
    toString(): string;
}
