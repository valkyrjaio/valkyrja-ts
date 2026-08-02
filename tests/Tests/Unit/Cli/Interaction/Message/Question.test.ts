/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { readSync } from 'node:fs';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Answer } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Answer.ts';
import { QuestionContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/QuestionContract.ts';
import { Question } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Question.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

vi.mock('node:fs', () => ({
    readSync: vi.fn(),
}));

const readSyncMock = vi.mocked(readSync);

// Feeds the given string to ask() one byte at a time, mirroring how readSync(0, …, 1, …) is called.
function feedStdin(input: string): void {
    const bytes = Buffer.from(input, 'utf8');
    let index = 0;

    readSyncMock.mockImplementation(((_fd: number, buffer: Buffer, offset: number): number => {
        if (index >= bytes.length) {
            return 0;
        }

        buffer[offset] = bytes[index] ?? 0;
        index += 1;

        return 1;
    }) as unknown as typeof readSync);
}

const callable = (output: OutputContract): OutputContract => output;

afterEach(() => {
    readSyncMock.mockReset();
});

describe('Question', () => {
    it('exposes its callable and answer', () => {
        const answer = new Answer('yes');
        const question = new Question('Continue?', callable, answer);

        expect(question.getCallable()).toBe(callable);
        expect(question.getAnswer()).toBe(answer);
    });

    it('withCallable and withAnswer return immutable clones', () => {
        const question = new Question('Continue?', callable, new Answer('yes'));

        const other = (output: OutputContract): OutputContract => output;
        const withCallable = question.withCallable(other);
        expect(withCallable).not.toBe(question);
        expect(withCallable.getCallable()).toBe(other);

        const newAnswer = new Answer('no');
        const withAnswer = question.withAnswer(newAnswer);
        expect(withAnswer).not.toBe(question);
        expect(withAnswer.getAnswer()).toBe(newAnswer);
    });

    it('ask records the trimmed user response from stdin', () => {
        feedStdin('hello\n');

        const answer = new Answer('default');
        const result = new Question('Name?', callable, answer).ask();

        expect(result.getUserResponse()).toBe('hello');
        expect(result.hasBeenAnswered()).toBe(true);
    });

    it('ask returns the original answer for an empty response', () => {
        feedStdin('\n');

        const answer = new Answer('default');
        const result = new Question('Name?', callable, answer).ask();

        expect(result).toBe(answer);
    });

    it('ask returns the original answer at end of input', () => {
        feedStdin('');

        const answer = new Answer('default');
        const result = new Question('Name?', callable, answer).ask();

        expect(result).toBe(answer);
    });

    it('ask returns the original answer when reading throws', () => {
        readSyncMock.mockImplementation(() => {
            throw new Error('no tty');
        });

        const answer = new Answer('default');
        const result = new Question('Name?', callable, answer).ask();

        expect(result).toBe(answer);
    });

    it('ask stops reading at the 1024 byte limit', () => {
        feedStdin('a'.repeat(2000));

        const answer = new Answer('default');
        const result = new Question('Name?', callable, answer).ask();

        expect(result.getUserResponse()).toBe('a'.repeat(1024));
    });

    it('instanceOf is true for a Question and false otherwise', () => {
        expect(QuestionContract.instanceOf(new Question('Q', callable, new Answer('yes')))).toBe(true);
        expect(QuestionContract.instanceOf(null)).toBe(false);
        expect(QuestionContract.instanceOf({})).toBe(false);
    });
});
