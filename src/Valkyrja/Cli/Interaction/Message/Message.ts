import type { FormatterContract } from '../Formatter/Contract/FormatterContract.js';
import type { MessageContract } from './Contract/MessageContract.js';
import { CliInteractionNoFormatterException } from '../Throwable/Exception/CliInteractionNoFormatterException.js';

export class Message implements MessageContract {
    constructor(
        protected text: string,
        protected formatter: FormatterContract | null = null,
    ) {}

    getText(): string {
        return this.text;
    }

    getFormattedText(): string {
        const text      = this.getText();
        const formatter = this.formatter;

        if (formatter === null) {
            return text;
        }

        return formatter.formatText(text);
    }

    withText(text: string): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.text   = text;
        return clone;
    }

    hasFormatter(): boolean {
        return this.formatter !== null;
    }

    getFormatter(): FormatterContract {
        if (this.formatter === null) {
            throw new CliInteractionNoFormatterException('No formatter has been set');
        }
        return this.formatter;
    }

    withFormatter(formatter: FormatterContract): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.formatter  = formatter;
        return clone;
    }

    withoutFormatter(): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.formatter  = null;
        return clone;
    }
}