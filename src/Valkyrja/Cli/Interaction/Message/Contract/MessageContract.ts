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