/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ExitCode } from '../../../Enum/ExitCode.ts';
import type { MessageContract } from '../../../Message/Contract/MessageContract.ts';
import type { EmptyOutputContract } from '../../Contract/EmptyOutputContract.ts';
import type { FileOutputContract } from '../../Contract/FileOutputContract.ts';
import type { OutputContract } from '../../Contract/OutputContract.ts';
import type { PlainOutputContract } from '../../Contract/PlainOutputContract.ts';
import type { StreamOutputContract } from '../../Contract/StreamOutputContract.ts';

export interface OutputFactoryContract {
    createOutput(exitCode?: ExitCode | number, ...messages: MessageContract[]): OutputContract;
    createEmptyOutput(exitCode?: ExitCode | number, ...messages: MessageContract[]): EmptyOutputContract;
    createPlainOutput(exitCode?: ExitCode | number, ...messages: MessageContract[]): PlainOutputContract;
    createFileOutput(
        filepath: string,
        exitCode?: ExitCode | number,
        ...messages: MessageContract[]
    ): FileOutputContract;
    createStreamOutput(
        stream: NodeJS.WritableStream,
        exitCode?: ExitCode | number,
        ...messages: MessageContract[]
    ): StreamOutputContract;
}

export namespace OutputFactoryContract {
    export function instanceOf(value: unknown): value is OutputFactoryContract {
        return typeof value === 'object' && value !== null && 'createOutput' in value;
    }
}
