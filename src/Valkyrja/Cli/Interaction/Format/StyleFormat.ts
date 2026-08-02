/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Style, styleDefault } from '../Enum/Style.ts';
import { Format } from './Format.ts';

export class StyleFormat extends Format {
    constructor(style: Style) {
        super(String(style), String(styleDefault(style)));
    }
}
