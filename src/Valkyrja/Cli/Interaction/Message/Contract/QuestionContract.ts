import type { OutputContract } from '../../Output/Contract/OutputContract.js';
import type { AnswerContract } from './AnswerContract.js';
import type { MessageContract } from './MessageContract.js';

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
