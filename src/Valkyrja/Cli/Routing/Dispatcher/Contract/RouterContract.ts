/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface RouterContract {
    dispatch(input: InputContract): OutputContract;
    dispatchRoute(input: InputContract, route: RouteContract): OutputContract;
}

export namespace RouterContract {
    export function instanceOf(value: unknown): value is RouterContract {
        return typeof value === 'object' && value !== null && 'dispatch' in value;
    }
}
