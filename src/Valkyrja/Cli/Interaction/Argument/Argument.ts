import type { ArgumentContract } from './Contract/ArgumentContract.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

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
