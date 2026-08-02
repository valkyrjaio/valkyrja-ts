/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
