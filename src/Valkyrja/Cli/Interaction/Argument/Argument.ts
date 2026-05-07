import type { ArgumentContract } from './Contract/ArgumentContract.js';

export class Argument implements ArgumentContract {
    constructor(protected value: string) {}

    getValue(): string {
        return this.value;
    }

    withValue(value: string): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.value   = value;
        return clone;
    }
}