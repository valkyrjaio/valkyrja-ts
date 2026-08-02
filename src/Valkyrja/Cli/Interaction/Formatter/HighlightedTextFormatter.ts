/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { TextColor } from '../Enum/TextColor.ts';
import { TextColorFormat } from '../Format/TextColorFormat.ts';
import { Formatter } from './Formatter.ts';

export class HighlightedTextFormatter extends Formatter {
    constructor() {
        super(new TextColorFormat(TextColor.YELLOW));
    }
}
