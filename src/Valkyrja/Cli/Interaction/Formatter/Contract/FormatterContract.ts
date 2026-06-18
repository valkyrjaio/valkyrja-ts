/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FormatContract } from '../../Format/Contract/FormatContract.ts';

export interface FormatterContract {
    getFormats(): FormatContract[];
    withFormats(...formats: FormatContract[]): this;
    formatText(text: string): string;
}

export namespace FormatterContract {
    export function instanceOf(value: unknown): value is FormatterContract {
        return typeof value === 'object' && value !== null && 'formatText' in value;
    }
}
