/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { FormatterContract } from '../Formatter/Contract/FormatterContract.ts';
import { Message } from './Message.ts';

export class NewLine extends Message {
    constructor(formatter: FormatterContract | null = null) {
        super('\n', formatter);
    }
}
