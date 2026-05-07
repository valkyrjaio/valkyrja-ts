import { readSync } from 'node:fs';

import type { FormatterContract } from '../Formatter/Contract/FormatterContract.js';
import type { AnswerContract } from './Contract/AnswerContract.js';
import type { QuestionContract } from './Contract/QuestionContract.js';
import type { OutputContract } from '../Output/Contract/OutputContract.js';
import { QuestionFormatter } from '../Formatter/QuestionFormatter.js';
import { Message } from './Message.js';

export class Question extends Message implements QuestionContract {
    constructor(
        text: string,
        protected callable: (output: OutputContract, answer: AnswerContract) => OutputContract,
        protected answer: AnswerContract,
        formatter: FormatterContract | null = new QuestionFormatter(),
    ) {
        super(text, formatter);
    }

    getCallable(): (output: OutputContract, answer: AnswerContract) => OutputContract {
        return this.callable;
    }

    withCallable(callable: (output: OutputContract, answer: AnswerContract) => OutputContract): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.callable   = callable;
        return clone;
    }

    getAnswer(): AnswerContract {
        return this.answer;
    }

    withAnswer(answer: AnswerContract): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.answer  = answer;
        return clone;
    }

    ask(): AnswerContract {
        const answer = this.answer;
        const buf    = Buffer.alloc(1024);

        let line = '';

        try {
            let bytesRead = 0;

            while (true) {
                const n = readSync(0, buf, 0, 1, null);

                if (n === 0) {
                    break;
                }

                const char = buf.toString('utf8', 0, n);

                if (char === '\n') {
                    break;
                }

                line       += char;
                bytesRead  += n;

                if (bytesRead >= 1024) {
                    break;
                }
            }
        } catch {
            return answer;
        }

        const response = line.trim();

        if (response === '') {
            return answer;
        }

        return answer.withUserResponse(response);
    }
}