import { Container } from '../../../Container/Manager/Container.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import { CliInteractionConfig } from '../../Interaction/Data/CliInteractionConfig.js';
import type { CliInteractionConfigContract } from '../../Interaction/Data/Contract/CliInteractionConfigContract.js';
import { ExitCode } from '../../Interaction/Enum/ExitCode.js';
import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import { Banner } from '../../Interaction/Message/Banner.js';
import { ErrorMessage } from '../../Interaction/Message/ErrorMessage.js';
import { Message } from '../../Interaction/Message/Message.js';
import { NewLine } from '../../Interaction/Message/NewLine.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import { OutputFactory } from '../../Interaction/Output/Factory/OutputFactory.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import type { ExitedHandlerContract } from '../../Middleware/Handler/Contract/ExitedHandlerContract.js';
import { ExitedHandler } from '../../Middleware/Handler/ExitedHandler.js';
import type { InputReceivedHandlerContract } from '../../Middleware/Handler/Contract/InputReceivedHandlerContract.js';
import { InputReceivedHandler } from '../../Middleware/Handler/InputReceivedHandler.js';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.js';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.js';
import { Router } from '../../Routing/Dispatcher/Router.js';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.js';
import { CliInteractionServiceId } from '../../Interaction/Constant/CliInteractionServiceId.js';
import { Exiter } from '../Support/Exiter.js';
import type { InputHandlerContract } from './Contract/InputHandlerContract.js';

export class InputHandler implements InputHandlerContract {
    constructor(
        protected container: ContainerContract = new Container(),
        protected router: RouterContract = new Router(),
        protected inputReceivedHandler: InputReceivedHandlerContract = new InputReceivedHandler(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected exitedHandler: ExitedHandlerContract = new ExitedHandler(),
        protected interactionConfig: CliInteractionConfigContract = new CliInteractionConfig(),
        protected outputFactory: OutputFactoryContract = new OutputFactory(),
    ) {}

    handle(input: InputContract): OutputContract {
        let output: OutputContract;

        try {
            output = this.dispatchRouter(input);
        } catch (throwable: unknown) {
            output = this.getOutputFromThrowable(input, throwable);
            output = this.throwableCaughtHandler.throwableCaught(input, output, throwable);
        }

        this.container.setSingleton<OutputContract>(CliInteractionServiceId.OutputContract, output!);

        return output!;
    }

    exit(input: InputContract, output: OutputContract): void {
        this.exitedHandler.exited(input, output);
    }

    run(input: InputContract): void {
        const output = this.handle(input);

        output.writeMessages();

        this.exit(input, output);

        const exitCode = output.getExitCode();

        Exiter.exit(Number(exitCode));
    }

    protected dispatchRouter(input: InputContract): OutputContract {
        this.container.setSingleton<InputContract>(CliInteractionServiceId.InputContract, input);

        const inputAfterMiddleware = this.inputReceivedHandler.inputReceived(input);

        if (this.isOutputContract(inputAfterMiddleware)) {
            return inputAfterMiddleware;
        }

        this.container.setSingleton<InputContract>(CliInteractionServiceId.InputContract, inputAfterMiddleware);

        return this.router.dispatch(inputAfterMiddleware);
    }

    protected getOutputFromThrowable(input: InputContract, throwable: unknown): OutputContract {
        const commandName = input.getCommandName();
        const message     = throwable instanceof Error ? throwable.message : String(throwable);

        return this.outputFactory
            .createOutput(ExitCode.ERROR)
            .withMessages(
                new Banner(new ErrorMessage('Cli Server Error:')),
                new NewLine(),
                new ErrorMessage('Command:'),
                new Message(` ${commandName}`),
                new NewLine(),
                new NewLine(),
                new ErrorMessage('Message:'),
                new Message(` ${message}`),
            );
    }

    protected isOutputContract(value: InputContract | OutputContract): value is OutputContract {
        return 'writeMessages' in value;
    }
}