import type { Cast } from '../../../../Type/Data/Cast.js';

export interface ParameterContract {
    getName(): string;
    withName(name: string): this;
    hasCast(): boolean;
    getCast(): Cast;
    withCast(cast: Cast): this;
    withoutCast(): this;
    getDescription(): string;
    withDescription(description: string): this;
    getCastValues(): unknown[];
    hasFirstValue(): boolean;
    getFirstValue(): string;
    areValuesValid(): boolean;
    validateValues(): this;
}
