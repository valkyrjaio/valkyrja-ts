import type { OptionType } from '../../Enum/OptionType.js';

export interface OptionContract {
    getName(): string;
    withName(name: string): this;
    hasValue(): boolean;
    getValue(): string;
    withValue(value: string): this;
    withoutValue(): this;
    getType(): OptionType;
    withType(type: OptionType): this;
}

export namespace OptionContract {
    export function instanceOf(value: unknown): value is OptionContract {
        return typeof value === 'object' && value !== null && 'getName' in value;
    }
}
