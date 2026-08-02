/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
