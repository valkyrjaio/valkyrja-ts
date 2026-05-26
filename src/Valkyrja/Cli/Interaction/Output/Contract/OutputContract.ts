/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ExitCode } from '../../Enum/ExitCode.js';
import type { MessageContract } from '../../Message/Contract/MessageContract.js';
import type { WriterContract } from '../../Writer/Contract/WriterContract.js';

export interface OutputContract {
    getMessages(): MessageContract[];
    getWrittenMessages(): MessageContract[];
    hasWrittenMessage(): boolean;
    getUnwrittenMessages(): MessageContract[];
    hasUnwrittenMessage(): boolean;
    withMessages(...messages: MessageContract[]): this;
    withAddedMessages(...messages: MessageContract[]): this;
    withAddedMessage(message: MessageContract): this;
    writeMessages(): this;
    writeMessage(message: MessageContract): this;
    getWriters(): WriterContract[];
    withWriters(...writers: WriterContract[]): this;
    isInteractive(): boolean;
    withIsInteractive(isInteractive: boolean): this;
    isQuiet(): boolean;
    withIsQuiet(isQuiet: boolean): this;
    isSilent(): boolean;
    withIsSilent(isSilent: boolean): this;
    getExitCode(): ExitCode | number;
    withExitCode(exitCode: ExitCode | number): this;
}

export namespace OutputContract {
    export function instanceOf(value: unknown): value is OutputContract {
        return typeof value === 'object' && value !== null && 'getMessages' in value;
    }
}
