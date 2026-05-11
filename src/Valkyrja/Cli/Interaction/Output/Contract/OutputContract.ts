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
