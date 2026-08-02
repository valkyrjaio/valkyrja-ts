/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { TextColor, textColorDefault } from '../Enum/TextColor.ts';
import { Format } from './Format.ts';

export class TextColorFormat extends Format {
    constructor(textColor: TextColor) {
        super(String(textColor), String(textColorDefault()));
    }
}
