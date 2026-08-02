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

export interface RouteNotMatchedHandlerContract extends HandlerContract {
    routeNotMatched(input: InputContract, output: OutputContract): OutputContract;
}

export namespace RouteNotMatchedHandlerContract {
    export function instanceOf(value: unknown): value is RouteNotMatchedHandlerContract {
        return typeof value === 'object' && value !== null && 'routeNotMatched' in value;
    }
}
