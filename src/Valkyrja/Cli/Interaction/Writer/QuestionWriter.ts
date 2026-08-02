/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { AnswerContract } from '../Message/Contract/AnswerContract.ts';
import type { MessageContract } from '../Message/Contract/MessageContract.ts';
import type { QuestionContract } from '../Message/Contract/QuestionContract.ts';
import type { OutputContract } from '../Output/Contract/OutputContract.ts';
import type { WriterContract } from './Contract/WriterContract.ts';
import { CliInteractionExpectedQuestionOutputException } from '../Throwable/Exception/CliInteractionExpectedQuestionOutputException.ts';
import { HighlightedTextFormatter } from '../Formatter/HighlightedTextFormatter.ts';
import { Message } from '../Message/Message.ts';
import { NewLine } from '../Message/NewLine.ts';

export class QuestionWriter implements WriterContract {
    shouldWriteMessage(message: MessageContract): boolean {
        return this.isQuestion(message);
    }

    write(output: OutputContract, message: MessageContract): OutputContract {
        if (!this.isQuestion(message)) {
            throw new CliInteractionExpectedQuestionOutputException('This writer expects only questions');
        }

        return this.askQuestion(output, message);
    }

    protected isQuestion(message: MessageContract): message is QuestionContract {
        return typeof (message as QuestionContract).ask === 'function';
    }

    protected askQuestion(output: OutputContract, question: QuestionContract): OutputContract {
        output = this.writeQuestion(output, question);

        let answer = question.getAnswer();

        if (output.isInteractive() && !output.isQuiet() && !output.isSilent()) {
            answer = question.ask();

            if (!answer.isValidResponse()) {
                output = this.writeAnswerAfterResponse(output, answer);
                return this.askQuestion(output, question);
            }
        }

        output = this.writeAnswerAfterResponse(output, answer);

        const callable = question.getCallable();
        output = callable(output, answer);

        return output;
    }

    protected writeQuestion(output: OutputContract, question: QuestionContract): OutputContract {
        output = output.writeMessage(question);

        const answer = question.getAnswer();
        const validResponses = answer.getAllowedResponses();

        // An answer always carries at least its default response, so there is always at least one
        // valid response to render.
        output = output.writeMessage(new Message(' ('));
        output = output.writeMessage(new Message(validResponses.map((v) => `\`${v}\``).join(' or ')));
        output = output.writeMessage(new Message(')'));

        output = output.writeMessage(new Message(' [default: "'));
        output = output.writeMessage(new Message(answer.getDefaultResponse(), new HighlightedTextFormatter()));
        output = output.writeMessage(new Message('"]'));
        output = output.writeMessage(new Message(':'));
        output = output.writeMessage(new NewLine());
        output = output.writeMessage(new Message('> '));

        return output;
    }

    protected writeAnswerAfterResponse(output: OutputContract, answer: AnswerContract): OutputContract {
        output = output.writeMessage(answer);
        output = output.writeMessage(new NewLine());
        return output;
    }
}
