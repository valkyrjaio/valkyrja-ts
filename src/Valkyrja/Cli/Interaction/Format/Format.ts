/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { FormatContract } from './Contract/FormatContract.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

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
