/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../Message/Contract/MessageContract.ts';
import type { EmptyOutputContract } from './Contract/EmptyOutputContract.ts';
import { Output } from './Output.ts';

export class EmptyOutput extends Output implements EmptyOutputContract {
    protected override outputMessage(_message: MessageContract): void {
        // empty on purpose
    }
}
