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

export interface InputReceivedHandlerContract extends HandlerContract {
    inputReceived(input: InputContract): InputContract | OutputContract;
}

export namespace InputReceivedHandlerContract {
    export function instanceOf(value: unknown): value is InputReceivedHandlerContract {
        return typeof value === 'object' && value !== null && 'inputReceived' in value;
    }
}
