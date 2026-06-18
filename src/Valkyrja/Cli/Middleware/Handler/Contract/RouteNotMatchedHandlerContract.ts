/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
