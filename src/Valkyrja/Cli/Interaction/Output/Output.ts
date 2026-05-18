import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { OutputContract } from './Contract/OutputContract.js';
import type { WriterContract } from '../Writer/Contract/WriterContract.js';
import { ExitCode } from '../Enum/ExitCode.js';
import { QuestionWriter } from '../Writer/QuestionWriter.js';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.js';

export class Output implements OutputContract {
    protected unwrittenMessages: MessageContract[] = [];
    protected writtenMessages: MessageContract[] = [];
    protected writers: WriterContract[] = [];

    constructor(
        protected interactive: boolean = true,
        protected quiet: boolean = false,
        protected silent: boolean = false,
        protected exitCode: ExitCode | number = ExitCode.SUCCESS,
        ...messages: MessageContract[]
    ) {
        this.unwrittenMessages = messages;
        this.writers = [new QuestionWriter()];
    }

    getMessages(): MessageContract[] {
        return [...this.writtenMessages, ...this.unwrittenMessages];
    }

    getWrittenMessages(): MessageContract[] {
        return this.writtenMessages;
    }

    hasWrittenMessage(): boolean {
        return this.writtenMessages.length > 0;
    }

    getUnwrittenMessages(): MessageContract[] {
        return this.unwrittenMessages;
    }

    hasUnwrittenMessage(): boolean {
        return this.unwrittenMessages.length > 0;
    }

    withMessages(...messages: MessageContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.unwrittenMessages = messages;
        return clone;
    }

    withAddedMessages(...messages: MessageContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.unwrittenMessages = [...this.unwrittenMessages, ...messages];
        return clone;
    }

    withAddedMessage(message: MessageContract): this {
        const clone = ObjectFactory.clone(this);
        clone.unwrittenMessages = [...this.unwrittenMessages, message];
        return clone;
    }

    writeMessages(): this {
        let clone = ObjectFactory.clone(this);
        const unwrittenMessages = this.unwrittenMessages;
        clone.unwrittenMessages = [];

        for (const message of unwrittenMessages) {
            clone = clone.writeMessageViaWriter(message);
        }

        return clone;
    }

    writeMessage(message: MessageContract): this {
        this.setMessageAsWritten(message);

        if (this.silent || (this.quiet && (this.exitCode as number) === (ExitCode.SUCCESS as number))) {
            return this;
        }

        this.outputMessage(message);

        return this;
    }

    getWriters(): WriterContract[] {
        return this.writers;
    }

    withWriters(...writers: WriterContract[]): this {
        const clone = ObjectFactory.clone(this);
        clone.writers = writers;
        return clone;
    }

    isInteractive(): boolean {
        return this.interactive;
    }

    withIsInteractive(isInteractive: boolean): this {
        const clone = ObjectFactory.clone(this);
        clone.interactive = isInteractive;
        return clone;
    }

    isQuiet(): boolean {
        return this.quiet;
    }

    withIsQuiet(isQuiet: boolean): this {
        const clone = ObjectFactory.clone(this);
        clone.quiet = isQuiet;
        return clone;
    }

    isSilent(): boolean {
        return this.silent;
    }

    withIsSilent(isSilent: boolean): this {
        const clone = ObjectFactory.clone(this);
        clone.silent = isSilent;
        return clone;
    }

    getExitCode(): ExitCode | number {
        return this.exitCode;
    }

    withExitCode(exitCode: ExitCode | number): this {
        const clone = ObjectFactory.clone(this);
        clone.exitCode = exitCode;
        return clone;
    }

    protected writeMessageViaWriter(message: MessageContract): this {
        for (const writer of this.writers) {
            if (writer.shouldWriteMessage(message)) {
                return writer.write(this, message) as this;
            }
        }

        return this.writeMessage(message);
    }

    protected setMessageAsWritten(message: MessageContract): void {
        this.writtenMessages.push(message);
    }

    protected outputMessage(message: MessageContract): void {
        process.stdout.write(message.getFormattedText());
    }
}
