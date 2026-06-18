/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessageContract } from '../../Message/Contract/MessageContract.ts';
import type { OutputContract } from '../../Output/Contract/OutputContract.ts';

export interface WriterContract {
    shouldWriteMessage(message: MessageContract): boolean;
    write(output: OutputContract, message: MessageContract): OutputContract;
}

export namespace WriterContract {
    export function instanceOf(value: unknown): value is WriterContract {
        return typeof value === 'object' && value !== null && 'write' in value;
    }
}
