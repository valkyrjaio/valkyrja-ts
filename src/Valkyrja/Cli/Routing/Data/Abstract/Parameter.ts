/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ParameterContract } from '../Contract/ParameterContract.ts';
import type { Cast } from '../../../../Type/Data/Cast.ts';
import { CliRoutingNoCastException } from '../../Throwable/Exception/CliRoutingNoCastException.ts';
import { ObjectFactory } from '../../../../Type/Object/Factory/ObjectFactory.ts';

export abstract class Parameter implements ParameterContract {
    constructor(
        protected name: string,
        protected description: string,
        protected cast: Cast | null = null,
    ) {}

    getName(): string {
        return this.name;
    }

    withName(name: string): this {
        const clone = ObjectFactory.clone(this);
        clone.name = name;
        return clone;
    }

    hasCast(): boolean {
        return this.cast !== null;
    }

    getCast(): Cast {
        if (this.cast === null) {
            throw new CliRoutingNoCastException('No cast exists');
        }
        return this.cast;
    }

    withCast(cast: Cast): this {
        const clone = ObjectFactory.clone(this);
        clone.cast = cast;
        return clone;
    }

    withoutCast(): this {
        const clone = ObjectFactory.clone(this);
        clone.cast = null;
        return clone;
    }

    getDescription(): string {
        return this.description;
    }

    withDescription(description: string): this {
        const clone = ObjectFactory.clone(this);
        clone.description = description;
        return clone;
    }

    abstract getValues(): string[];

    abstract isProvided(): boolean;
    abstract hasFirstValue(): boolean;
    abstract getFirstValue(): string;
    abstract areValuesValid(): boolean;
    abstract validateValues(): this;
}
