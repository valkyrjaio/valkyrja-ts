import type { ArgumentContract } from '../../../Interaction/Argument/Contract/ArgumentContract.js';
import type { OptionContract } from '../../../Interaction/Option/Contract/OptionContract.js';
import type { ParameterContract } from '../Contract/ParameterContract.js';
import type { Cast } from '../../../../Type/Data/Cast.js';
import { CliRoutingNoCastException } from '../../Throwable/Exception/CliRoutingNoCastException.js';
import { ObjectFactory } from '../../../../Type/Object/Factory/ObjectFactory.js';

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
