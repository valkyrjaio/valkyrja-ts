/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ExitCode } from '../../Enum/ExitCode.ts';
import type { MessageContract } from '../../Message/Contract/MessageContract.ts';
import type { WriterContract } from '../../Writer/Contract/WriterContract.ts';

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
