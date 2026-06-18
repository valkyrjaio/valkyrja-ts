/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
