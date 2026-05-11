import type { InputContract } from '../../../Interaction/Input/Contract/InputContract.js';
import { Answer } from '../../../Interaction/Message/Answer.js';
import type { AnswerContract } from '../../../Interaction/Message/Contract/AnswerContract.js';
import { NewLine } from '../../../Interaction/Message/NewLine.js';
import { Question } from '../../../Interaction/Message/Question.js';
import type { OutputContract } from '../../../Interaction/Output/Contract/OutputContract.js';
import type { RouteNotMatchedMiddlewareContract } from '../../../Middleware/Contract/RouteNotMatchedMiddlewareContract.js';
import type { RouteNotMatchedHandlerContract } from '../../../Middleware/Handler/Contract/RouteNotMatchedHandlerContract.js';
import type { RouteCollectionContract } from '../../../Routing/Collection/Contract/RouteCollectionContract.js';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.js';
import type { RouterContract } from '../../../Routing/Dispatcher/Contract/RouterContract.js';

export class CheckCommandForTypoMiddleware implements RouteNotMatchedMiddlewareContract {
    protected matchedRoute: RouteContract | null = null;

    constructor(
        protected router: RouterContract,
        protected collection: RouteCollectionContract,
        protected defaultAnswer: string = 'no',
    ) {}

    routeNotMatched(input: InputContract, output: OutputContract, handler: RouteNotMatchedHandlerContract): OutputContract {
        const routeOrOutput = this.checkCommandNameForTypo(input, output);

        if (this.isRouteContract(routeOrOutput)) {
            output = this.router.dispatch(input.withCommandName(routeOrOutput.getName()));
        }

        return handler.routeNotMatched(input, output);
    }

    protected checkCommandNameForTypo(input: InputContract, output: OutputContract): RouteContract | OutputContract {
        const name     = input.getCommandName();
        const commands = Object.values(this.collection.all()).filter((command) => {
            const percent = this.similarText(command.getName(), name);
            return percent >= 60;
        });

        if (commands.length > 0) {
            return this.askToRunSimilarCommands(output, commands);
        }

        return output;
    }

    protected askToRunSimilarCommands(output: OutputContract, commands: RouteContract[]): RouteContract | OutputContract {
        const commandNames = commands.map((c) => c.getName());

        output = output
            .withAddedMessages(
                new NewLine(),
                new Question(
                    'Did you mean to run one of the following commands?',
                    (out: OutputContract, answer: AnswerContract): OutputContract =>
                        this.questionCallback(out, answer, commands),
                    new Answer(this.defaultAnswer, null, false, 'You answered: `%s`', null, commandNames),
                ),
            )
            .writeMessages();

        return this.matchedRoute ?? output;
    }

    protected questionCallback(output: OutputContract, answer: AnswerContract, commands: RouteContract[]): OutputContract {
        const response      = answer.getUserResponse();
        this.matchedRoute   = response !== 'no' ? this.getMatchedRoute(commands, response) : null;
        return output;
    }

    protected getMatchedRoute(commands: RouteContract[], response: string): RouteContract | null {
        return commands.find((c) => c.getName() === response) ?? null;
    }

    protected similarText(a: string, b: string): number {
        if (a === b) return 100;
        if (a.length === 0 || b.length === 0) return 0;

        let common = 0;
        const aUsed = new Array<boolean>(a.length).fill(false);
        const bUsed = new Array<boolean>(b.length).fill(false);

        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                if (!aUsed[i] && !bUsed[j] && a[i] === b[j]) {
                    aUsed[i] = true;
                    bUsed[j] = true;
                    common++;
                    break;
                }
            }
        }

        return (2 * common / (a.length + b.length)) * 100;
    }

    protected isRouteContract(value: RouteContract | OutputContract): value is RouteContract {
        return 'getHandler' in value;
    }
}
