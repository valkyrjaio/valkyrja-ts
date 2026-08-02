/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../Message/Contract/MessageContract.ts';
import type { PlainOutputContract } from './Contract/PlainOutputContract.ts';
import { Output } from './Output.ts';

export class PlainOutput extends Output implements PlainOutputContract {
    protected override outputMessage(message: MessageContract): void {
        process.stdout.write(message.getText().replace(/<[^>]*>/g, ''));
    }
}
