import type { FormatterContract } from '../../Formatter/Contract/FormatterContract.js';

export interface MessageContract {
    getText(): string;
    getFormattedText(): string;
    withText(text: string): this;
    hasFormatter(): boolean;
    getFormatter(): FormatterContract;
    withFormatter(formatter: FormatterContract): this;
    withoutFormatter(): this;
}

export namespace MessageContract {
    export function instanceOf(value: unknown): value is MessageContract {
        return typeof value === 'object' && value !== null && 'getText' in value;
    }
}
