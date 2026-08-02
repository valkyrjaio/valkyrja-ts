/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FormatterContract } from '../../Formatter/Contract/FormatterContract.ts';

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
