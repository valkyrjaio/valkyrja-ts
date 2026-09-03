/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ArgumentContract } from '../../../Interaction/Argument/Contract/ArgumentContract.ts';
import type { OptionContract } from '../../../Interaction/Option/Contract/OptionContract.ts';
import type { ParameterContract } from '../Contract/ParameterContract.ts';
import type { Cast } from '../../../../Type/Data/Cast.ts';
import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.ts';
import type { TypeContract } from '../../../../Type/Contract/TypeContract.ts';
import { CliRoutingNoCastException } from '../../Throwable/Exception/CliRoutingNoCastException.ts';
import { ObjectFactory } from '../../../../Type/Object/Factory/ObjectFactory.ts';

export abstract class Parameter implements ParameterContract {
    constructor(
        protected name: string,
        protected description: string,
        protected cast: Cast | null = null,
        protected container: ContainerContract | null = null,
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

    withContainer(container: ContainerContract): this {
        const clone = ObjectFactory.clone(this);
        clone.container = container;
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

    abstract getCastValues(): unknown[];

    protected getCastValuesForParameters(parameters: Array<ArgumentContract | OptionContract>): unknown[] {
        const cast = this.cast;
        const container = this.container;

        if (cast === null || container === null) {
            return parameters.map((param) => param.getValue());
        }

        return parameters.map((param) => {
            const type = container.get<TypeContract>(cast.type, [param.getValue()]);

            return cast.convert ? type.asValue() : type;
        });
    }

    abstract isProvided(): boolean;
    abstract hasFirstValue(): boolean;
    abstract getFirstValue(): string;
    abstract areValuesValid(): boolean;
    abstract validateValues(): this;
}
