/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ArgumentContract } from '../../../Interaction/Argument/Contract/ArgumentContract.ts';
import type { OptionContract } from '../../../Interaction/Option/Contract/OptionContract.ts';
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

    abstract getCastValues(): unknown[];

    protected getCastValuesForParameters(parameters: Array<ArgumentContract | OptionContract>): unknown[] {
        const values: unknown[] = [];
        const cast = this.cast;

        for (const param of parameters) {
            const paramValue = param.getValue();

            if (cast === null) {
                values.push(paramValue);
                continue;
            }

            values.push(paramValue);
        }

        return values;
    }

    abstract hasFirstValue(): boolean;
    abstract getFirstValue(): string;
    abstract areValuesValid(): boolean;
    abstract validateValues(): this;
}
