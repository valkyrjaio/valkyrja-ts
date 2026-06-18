/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FormatterContract } from '../Formatter/Contract/FormatterContract.ts';
import type { MessageContract } from './Contract/MessageContract.ts';
import { CliInteractionNoFormatterException } from '../Throwable/Exception/CliInteractionNoFormatterException.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export class Message implements MessageContract {
    constructor(
        protected text: string,
        protected formatter: FormatterContract | null = null,
    ) {}

    getText(): string {
        return this.text;
    }

    getFormattedText(): string {
        const text = this.getText();
        const formatter = this.formatter;

        if (formatter === null) {
            return text;
        }

        return formatter.formatText(text);
    }

    withText(text: string): this {
        const clone = ObjectFactory.clone(this);
        clone.text = text;
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
        const clone = ObjectFactory.clone(this);
        clone.formatter = formatter;
        return clone;
    }

    withoutFormatter(): this {
        const clone = ObjectFactory.clone(this);
        clone.formatter = null;
        return clone;
    }
}
