import { OptionType } from '../Enum/OptionType.js';

import type { OptionContract } from './Contract/OptionContract.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

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
        const clone  = ObjectFactory.clone(this);
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
        const clone  = ObjectFactory.clone(this);
        clone.value  = value;
        return clone;
    }

    withoutValue(): this {
        const clone  = ObjectFactory.clone(this);
        clone.value  = '';
        return clone;
    }

    getType(): OptionType {
        return this.type;
    }

    withType(type: OptionType): this {
        const clone  = ObjectFactory.clone(this);
        clone.type   = type;
        return clone;
    }
}
