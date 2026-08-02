/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import type { ProcessExitingHandlerContract } from '../Handler/Contract/ProcessExitingHandlerContract.ts';

export interface ProcessExitingMiddlewareContract {
    processExiting(input: InputContract, output: OutputContract, handler: ProcessExitingHandlerContract): void;
}

export namespace ProcessExitingMiddlewareContract {
    export function instanceOf(value: unknown): value is ProcessExitingMiddlewareContract {
        return typeof value === 'object' && value !== null && 'processExiting' in value;
    }
}
