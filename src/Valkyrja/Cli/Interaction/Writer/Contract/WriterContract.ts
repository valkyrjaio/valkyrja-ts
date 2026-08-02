/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../../Message/Contract/MessageContract.ts';
import type { OutputContract } from '../../Output/Contract/OutputContract.ts';

export interface WriterContract {
    shouldWriteMessage(message: MessageContract): boolean;
    write(output: OutputContract, message: MessageContract): OutputContract;
}

export namespace WriterContract {
    export function instanceOf(value: unknown): value is WriterContract {
        return typeof value === 'object' && value !== null && 'write' in value;
    }
}
