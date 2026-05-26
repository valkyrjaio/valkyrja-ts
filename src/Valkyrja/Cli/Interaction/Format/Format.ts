/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FormatContract } from './Contract/FormatContract.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class Format implements FormatContract {
    constructor(
        protected setCode: string,
        protected unsetCode: string,
    ) {}

    getSetCode(): string {
        return this.setCode;
    }

    withSetCode(setCode: string): this {
        const clone = ObjectFactory.clone(this);
        clone.setCode = setCode;
        return clone;
    }

    getUnsetCode(): string {
        return this.unsetCode;
    }

    withUnsetCode(unsetCode: string): this {
        const clone = ObjectFactory.clone(this);
        clone.unsetCode = unsetCode;
        return clone;
    }
}
