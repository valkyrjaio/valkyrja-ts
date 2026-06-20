/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { Answer } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Answer.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { CliInteractionExpectedQuestionOutputException } from '../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionExpectedQuestionOutputException.ts';
import { QuestionWriter } from '../../../../../../src/Valkyrja/Cli/Interaction/Writer/QuestionWriter.ts';

import type { AnswerContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/AnswerContract.ts';
import type { QuestionContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/QuestionContract.ts';
import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => {
    stdoutSpy.mockClear();
});

interface StubOptions {
    answer: AnswerContract;
    callable: (output: OutputContract, answer: AnswerContract) => OutputContract;
    ask?: () => AnswerContract;
}

function stubQuestion(options: StubOptions): QuestionContract {
    return {
        ask: vi.fn(options.ask ?? (() => options.answer)),
        getAnswer: () => options.answer,
        getCallable: () => options.callable,
        getText: () => 'Continue?',
        getFormattedText: () => 'Continue?',
    } as unknown as QuestionContract;
}

describe('QuestionWriter', () => {
    it('only writes questions', () => {
        const writer = new QuestionWriter();

        expect(writer.shouldWriteMessage(stubQuestion({ answer: new Answer('yes'), callable: (o) => o }))).toBe(true);
        expect(writer.shouldWriteMessage(new Message('plain'))).toBe(false);
    });

    it('throws when asked to write a non-question', () => {
        expect(() => new QuestionWriter().write(new Output(), new Message('plain'))).toThrow(
            CliInteractionExpectedQuestionOutputException,
        );
    });

    it('uses the default answer when the output is not interactive', () => {
        const callable = vi.fn((output: OutputContract) => output);
        const answer = new Answer('yes');
        const question = stubQuestion({ answer, callable });

        const output = new Output(false);
        new QuestionWriter().write(output, question);

        expect(question.ask).not.toHaveBeenCalled();
        expect(callable).toHaveBeenCalledTimes(1);
    });

    it('omits the allowed-responses list when there are none', () => {
        const callable = vi.fn((output: OutputContract) => output);
        // A real answer whose allowed-responses list is empty (the public constructor always keeps
        // at least the default, so override the accessor to exercise the empty branch).
        class EmptyAnswer extends Answer {
            override getAllowedResponses(): string[] {
                return [];
            }
        }
        const question = stubQuestion({ answer: new EmptyAnswer('yes'), callable });

        new QuestionWriter().write(new Output(false), question);

        expect(callable).toHaveBeenCalledTimes(1);
    });

    it('asks the user and accepts a valid response when interactive', () => {
        const callable = vi.fn((output: OutputContract) => output);
        const answer = new Answer('yes');
        const validResponse = answer.withUserResponse('yes');
        const question = stubQuestion({ answer, callable, ask: () => validResponse });

        const output = new Output(true);
        new QuestionWriter().write(output, question);

        expect(question.ask).toHaveBeenCalledTimes(1);
        expect(callable).toHaveBeenCalledTimes(1);
    });

    it('re-asks until the response is valid', () => {
        const callable = vi.fn((output: OutputContract) => output);
        const answer = new Answer('yes');
        const invalidResponse = answer.withUserResponse('nope');
        const validResponse = answer.withUserResponse('yes');
        const ask = vi.fn<() => AnswerContract>();
        ask.mockReturnValueOnce(invalidResponse).mockReturnValueOnce(validResponse);
        const question = stubQuestion({ answer, callable, ask });

        const output = new Output(true);
        new QuestionWriter().write(output, question);

        expect(ask).toHaveBeenCalledTimes(2);
        expect(callable).toHaveBeenCalledTimes(1);
    });
});
