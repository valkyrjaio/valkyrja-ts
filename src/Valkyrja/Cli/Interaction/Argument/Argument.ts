/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ArgumentContract } from './Contract/ArgumentContract.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class Argument implements ArgumentContract {
    constructor(protected value: string) {}

    getValue(): string {
        return this.value;
    }

    withValue(value: string): this {
        const clone = ObjectFactory.clone(this);
        clone.value = value;
        return clone;
    }
}
