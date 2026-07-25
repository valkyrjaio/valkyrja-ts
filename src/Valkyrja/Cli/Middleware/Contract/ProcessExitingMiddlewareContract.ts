/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
