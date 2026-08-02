/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface InputReceivedHandlerContract extends HandlerContract {
    inputReceived(input: InputContract): InputContract | OutputContract;
}

export namespace InputReceivedHandlerContract {
    export function instanceOf(value: unknown): value is InputReceivedHandlerContract {
        return typeof value === 'object' && value !== null && 'inputReceived' in value;
    }
}
