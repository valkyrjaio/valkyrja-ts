/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { BackgroundColor } from '../Enum/BackgroundColor.ts';
import { TextColor } from '../Enum/TextColor.ts';
import { BackgroundColorFormat } from '../Format/BackgroundColorFormat.ts';
import { TextColorFormat } from '../Format/TextColorFormat.ts';
import { Formatter } from './Formatter.ts';

export class WarningFormatter extends Formatter {
    constructor() {
        super(new TextColorFormat(TextColor.BLACK), new BackgroundColorFormat(BackgroundColor.YELLOW));
    }
}
