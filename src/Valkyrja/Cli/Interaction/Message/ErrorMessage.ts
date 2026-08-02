/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ErrorFormatter } from '../Formatter/ErrorFormatter.ts';
import { Message } from './Message.ts';

export class ErrorMessage extends Message {
    constructor(text: string) {
        super(text, new ErrorFormatter());
    }
}
