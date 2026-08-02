/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';

export interface ThrowableCaughtMiddlewareContract {
    throwableCaught(
        input: InputContract,
        output: OutputContract,
        throwable: unknown,
        handler: ThrowableCaughtHandlerContract,
    ): OutputContract;
}

export namespace ThrowableCaughtMiddlewareContract {
    export function instanceOf(value: unknown): value is ThrowableCaughtMiddlewareContract {
        return typeof value === 'object' && value !== null && 'throwableCaught' in value;
    }
}
