import { OptionType } from '../Enum/OptionType.js';

import type { OptionContract } from './Contract/OptionContract.js';

export class Option implements OptionContract {
    constructor(
        protected name: string,
        protected value: string = '',
        protected type: OptionType = OptionType.LONG,
    ) {}

    getName(): string {
        return this.name;
    }

    withName(name: string): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.name   = name;
        return clone;
    }

    hasValue(): boolean {
        return this.value !== '';
    }

    getValue(): string {
        return this.value;
    }

    withValue(value: string): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.value  = value;
        return clone;
    }

    withoutValue(): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.value  = '';
        return clone;
    }

    getType(): OptionType {
        return this.type;
    }

    withType(type: OptionType): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.type   = type;
        return clone;
    }
}