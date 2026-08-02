/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { OutputContract } from '../../Output/Contract/OutputContract.ts';
import type { AnswerContract } from './AnswerContract.ts';
import type { MessageContract } from './MessageContract.ts';

export interface QuestionContract extends MessageContract {
    getCallable(): (output: OutputContract, answer: AnswerContract) => OutputContract;
    withCallable(callable: (output: OutputContract, answer: AnswerContract) => OutputContract): this;
    getAnswer(): AnswerContract;
    withAnswer(answer: AnswerContract): this;
    ask(): AnswerContract;
}

export namespace QuestionContract {
    export function instanceOf(value: unknown): value is QuestionContract {
        return typeof value === 'object' && value !== null && 'ask' in value;
    }
}
