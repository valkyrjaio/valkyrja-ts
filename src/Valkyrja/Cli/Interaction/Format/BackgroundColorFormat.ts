/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { BackgroundColor, backgroundColorDefault } from '../Enum/BackgroundColor.ts';
import { Format } from './Format.ts';

export class BackgroundColorFormat extends Format {
    constructor(backgroundColor: BackgroundColor) {
        super(String(backgroundColor), String(backgroundColorDefault()));
    }
}
