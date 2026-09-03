/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../Message/Contract/MessageContract.ts';
import type { OutputContract } from './Contract/OutputContract.ts';
import type { WriterContract } from '../Writer/Contract/WriterContract.ts';
import { ExitCode } from '../Enum/ExitCode.ts';
import { QuestionWriter } from '../Writer/QuestionWriter.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

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
        const clone = this.cloneOutput();
        clone.unwrittenMessages = messages;
        return clone;
    }

    withAddedMessages(...messages: MessageContract[]): this {
        const clone = this.cloneOutput();
        clone.unwrittenMessages = [...this.unwrittenMessages, ...messages];
        return clone;
    }

    withAddedMessage(message: MessageContract): this {
        const clone = this.cloneOutput();
        clone.unwrittenMessages = [...this.unwrittenMessages, message];
        return clone;
    }

    writeMessages(): this {
        let clone = this.cloneOutput();
        const unwrittenMessages = this.unwrittenMessages;
        clone.unwrittenMessages = [];

        for (const message of unwrittenMessages) {
            clone = clone.writeMessageViaWriter(message);
        }

        return clone;
    }

    writeMessage(message: MessageContract): this {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (!this.silent && !(this.quiet && this.exitCode === ExitCode.SUCCESS)) {
            this.outputMessage(message);
        }

        this.setMessageAsWritten(message);

        return this;
    }

    getWriters(): WriterContract[] {
        return this.writers;
    }

    withWriters(...writers: WriterContract[]): this {
        const clone = this.cloneOutput();
        clone.writers = writers;
        return clone;
    }

    isInteractive(): boolean {
        return this.interactive;
    }

    withIsInteractive(isInteractive: boolean): this {
        const clone = this.cloneOutput();
        clone.interactive = isInteractive;
        return clone;
    }

    isQuiet(): boolean {
        return this.quiet;
    }

    withIsQuiet(isQuiet: boolean): this {
        const clone = this.cloneOutput();
        clone.quiet = isQuiet;
        return clone;
    }

    isSilent(): boolean {
        return this.silent;
    }

    withIsSilent(isSilent: boolean): this {
        const clone = this.cloneOutput();
        clone.silent = isSilent;
        return clone;
    }

    getExitCode(): ExitCode | number {
        return this.exitCode;
    }

    withExitCode(exitCode: ExitCode | number): this {
        const clone = this.cloneOutput();
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

    /**
     * Copy this output onto a new one.
     *
     * ObjectFactory.clone copies each property, so the copy would hold the same two message
     * arrays. A write pushes onto writtenMessages, and that push would reach this output as
     * well, which a failed write leaves counting a message it never wrote.
     */
    protected cloneOutput(): this {
        const clone = ObjectFactory.clone(this);
        clone.unwrittenMessages = [...this.unwrittenMessages];
        clone.writtenMessages = [...this.writtenMessages];
        return clone;
    }

    protected outputMessage(message: MessageContract): void {
        process.stdout.write(message.getFormattedText());
    }
}
