/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerContract } from '../../../../src/Valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { TypeContract } from '../../../../src/Valkyrja/Type/Contract/TypeContract.ts';
import { ObjectFactory } from '../../../../src/Valkyrja/Type/Object/Factory/ObjectFactory.ts';

export class TypeFixture implements TypeContract {
    constructor(protected value: string) {}

    static make(_container: ContainerContract, args: unknown[] = []): TypeFixture {
        return new TypeFixture(String(args[0]));
    }

    asValue(): unknown {
        return `cast:${this.value}`;
    }

    asFlatValue(): string | number | boolean | null {
        return `cast:${this.value}`;
    }

    modify(closure: (value: unknown) => unknown): this {
        const clone = ObjectFactory.clone(this);
        clone.value = String(closure(this.value));
        return clone;
    }
}
