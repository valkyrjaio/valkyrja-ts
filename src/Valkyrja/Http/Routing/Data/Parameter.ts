import { Cast } from '../../../Type/Data/Cast.js';
import { HttpRoutingNoCastException } from '../Throwable/Exception/HttpRoutingNoCastException.js';

import type { ParameterContract } from './Contract/ParameterContract.js';

export class Parameter implements ParameterContract {
    constructor(
        protected name: string,
        protected regex: string,
        protected cast: Cast | null = null,
        protected optional: boolean = false,
        protected capture: boolean = true,
        protected defaultValue: unknown = null,
        protected val: unknown = null,
    ) {}

    getName(): string {
        return this.name;
    }

    withName(name: string): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.name      = name;
        return clone;
    }

    getRegex(): string {
        return this.regex;
    }

    withRegex(regex: string): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.regex     = regex;
        return clone;
    }

    hasCast(): boolean {
        return this.cast !== null;
    }

    getCast(): Cast {
        if (this.cast === null) {
            throw new HttpRoutingNoCastException('No cast exists');
        }

        return this.cast;
    }

    withCast(cast: Cast): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.cast      = cast;
        return clone;
    }

    isOptional(): boolean {
        return this.optional;
    }

    withIsOptional(isOptional: boolean): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.optional   = isOptional;
        return clone;
    }

    shouldCapture(): boolean {
        return this.capture;
    }

    withShouldCapture(shouldCapture: boolean): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.capture    = shouldCapture;
        return clone;
    }

    getDefault(): unknown {
        return this.defaultValue;
    }

    withDefault(defaultValue: unknown = null): this {
        const clone           = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.defaultValue    = defaultValue;
        return clone;
    }

    getValue(): unknown {
        return this.val;
    }

    withValue(value: unknown = null): this {
        const clone     = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.val       = value;
        return clone;
    }
}