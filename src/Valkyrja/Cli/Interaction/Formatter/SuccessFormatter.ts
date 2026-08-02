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

export class SuccessFormatter extends Formatter {
    constructor() {
        super(new TextColorFormat(TextColor.LIGHT_WHITE), new BackgroundColorFormat(BackgroundColor.GREEN));
    }
}
