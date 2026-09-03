/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { QuestionWriter } from '../../../../../../src/Valkyrja/Cli/Interaction/Writer/QuestionWriter.ts';

import type { MessageContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/MessageContract.ts';
import type { WriterContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Writer/Contract/WriterContract.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => {
    // mockClear leaves a once implementation queued, and only mockReset drops it.
    stdoutSpy.mockReset();
    stdoutSpy.mockImplementation(() => true);
});

describe('Output', () => {
    it('leaves the receiver unchanged when a write fails part-way', () => {
        const first = new Message('first');
        const second = new Message('second');
        const output = new Output().withMessages(first, second);

        // The first message writes, and the second one fails.
        stdoutSpy
            .mockImplementationOnce(() => true)
            .mockImplementationOnce(() => {
                throw new Error('stdout');
            });

        expect(() => output.writeMessages()).toThrow('stdout');
        // The receiver keeps both messages to write, and counts neither as written.
        expect(output.hasWrittenMessage()).toBe(false);
        expect(output.getMessages()).toStrictEqual([first, second]);
    });

    it('defaults to an interactive, non-quiet, non-silent successful output with a question writer', () => {
        const output = new Output();

        expect(output.isInteractive()).toBe(true);
        expect(output.isQuiet()).toBe(false);
        expect(output.isSilent()).toBe(false);
        expect(output.getExitCode()).toBe(ExitCode.SUCCESS);
        expect(output.getWriters()[0]).toBeInstanceOf(QuestionWriter);
    });

    it('tracks written and unwritten messages', () => {
        const message = new Message('a');
        const output = new Output(true, false, false, ExitCode.SUCCESS, message);

        expect(output.hasUnwrittenMessage()).toBe(true);
        expect(output.hasWrittenMessage()).toBe(false);
        expect(output.getUnwrittenMessages()).toStrictEqual([message]);
        expect(output.getMessages()).toStrictEqual([message]);
    });

    it('withMessages, withAddedMessages and withAddedMessage return immutable clones', () => {
        const output = new Output(true, false, false, ExitCode.SUCCESS, new Message('a'));

        const replaced = output.withMessages(new Message('b'));
        expect(replaced).not.toBe(output);
        expect(replaced.getUnwrittenMessages()).toHaveLength(1);

        const added = output.withAddedMessages(new Message('b'), new Message('c'));
        expect(added.getUnwrittenMessages()).toHaveLength(3);

        const addedOne = output.withAddedMessage(new Message('b'));
        expect(addedOne.getUnwrittenMessages()).toHaveLength(2);
    });

    it('exposes immutable clones for each flag and the exit code', () => {
        const output = new Output();

        expect(output.withIsInteractive(false).isInteractive()).toBe(false);
        expect(output.withIsQuiet(true).isQuiet()).toBe(true);
        expect(output.withIsSilent(true).isSilent()).toBe(true);
        expect(output.withExitCode(ExitCode.ERROR).getExitCode()).toBe(ExitCode.ERROR);
        expect(output.withWriters().getWriters()).toHaveLength(0);
    });

    it('writes a message to stdout and records it as written', () => {
        const output = new Output();
        const message = new Message('hello');

        output.writeMessage(message);

        expect(stdoutSpy).toHaveBeenCalledWith('hello');
        expect(output.hasWrittenMessage()).toBe(true);
        expect(output.getWrittenMessages()).toStrictEqual([message]);
    });

    it('does not output when silent', () => {
        new Output(true, false, true).writeMessage(new Message('hello'));

        expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('does not output when quiet and successful', () => {
        new Output(true, true, false, ExitCode.SUCCESS).writeMessage(new Message('hello'));

        expect(stdoutSpy).not.toHaveBeenCalled();
    });

    it('outputs when quiet but unsuccessful', () => {
        new Output(true, true, false, ExitCode.ERROR).writeMessage(new Message('hello'));

        expect(stdoutSpy).toHaveBeenCalledWith('hello');
    });

    it('writeMessages writes each unwritten message via the fall-through writer', () => {
        const output = new Output(true, false, false, ExitCode.SUCCESS, new Message('a'), new Message('b'));

        const result = output.writeMessages();

        expect(result.hasUnwrittenMessage()).toBe(false);
        expect(stdoutSpy).toHaveBeenCalledTimes(2);
    });

    it('writeMessages delegates to a matching writer', () => {
        const writeSpy = vi.fn((output: OutputContract) => output);
        const writer: WriterContract = {
            shouldWriteMessage: (message: MessageContract): boolean => message.getText() === 'route',
            write: writeSpy,
        };
        const output = new Output(true, false, false, ExitCode.SUCCESS, new Message('route')).withWriters(writer);

        output.writeMessages();

        expect(writeSpy).toHaveBeenCalledTimes(1);
    });

    it('instanceOf is true for an Output and false otherwise', () => {
        expect(OutputContract.instanceOf(new Output())).toBe(true);
        expect(OutputContract.instanceOf(null)).toBe(false);
        expect(OutputContract.instanceOf({})).toBe(false);
    });
});
