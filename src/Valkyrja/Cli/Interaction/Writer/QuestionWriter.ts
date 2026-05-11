import type { AnswerContract } from '../Message/Contract/AnswerContract.js';
import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { QuestionContract } from '../Message/Contract/QuestionContract.js';
import type { OutputContract } from '../Output/Contract/OutputContract.js';
import type { WriterContract } from './Contract/WriterContract.js';
import { CliInteractionExpectedQuestionOutputException } from '../Throwable/Exception/CliInteractionExpectedQuestionOutputException.js';
import { HighlightedTextFormatter } from '../Formatter/HighlightedTextFormatter.js';
import { Message } from '../Message/Message.js';
import { NewLine } from '../Message/NewLine.js';

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
        output         = callable(output, answer);

        return output;
    }

    protected writeQuestion(output: OutputContract, question: QuestionContract): OutputContract {
        output = output.writeMessage(question);

        const answer          = question.getAnswer();
        const validResponses  = answer.getAllowedResponses();

        if (validResponses.length > 0) {
            output = output.writeMessage(new Message(' ('));
            output = output.writeMessage(new Message(validResponses.map((v) => `\`${v}\``).join(' or ')));
            output = output.writeMessage(new Message(')'));
        }

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
