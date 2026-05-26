/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { ExitedHandlerContract } from '../Handler/Contract/ExitedHandlerContract.js';

export interface ExitedMiddlewareContract {
    exited(input: InputContract, output: OutputContract, handler: ExitedHandlerContract): void;
}

export namespace ExitedMiddlewareContract {
    export function instanceOf(value: unknown): value is ExitedMiddlewareContract {
        return typeof value === 'object' && value !== null && 'exited' in value;
    }
}
