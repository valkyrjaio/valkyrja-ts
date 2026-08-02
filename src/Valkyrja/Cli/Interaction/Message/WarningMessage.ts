/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { WarningFormatter } from '../Formatter/WarningFormatter.ts';
import { Message } from './Message.ts';

export class WarningMessage extends Message {
    constructor(text: string) {
        super(text, new WarningFormatter());
    }
}
