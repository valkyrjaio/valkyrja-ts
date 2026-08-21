/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Container } from '../../../Container/Manager/Container.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import { CliInteractionConfig } from '../../Interaction/Data/CliInteractionConfig.ts';
import type { CliInteractionConfigContract } from '../../Interaction/Data/Contract/CliInteractionConfigContract.ts';
import { ExitCode } from '../../Interaction/Enum/ExitCode.ts';
import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import { Banner } from '../../Interaction/Message/Banner.ts';
import { ErrorMessage } from '../../Interaction/Message/ErrorMessage.ts';
import { Message } from '../../Interaction/Message/Message.ts';
import { NewLine } from '../../Interaction/Message/NewLine.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import { OutputFactory } from '../../Interaction/Output/Factory/OutputFactory.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import type { ProcessExitingHandlerContract } from '../../Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import { ProcessExitingHandler } from '../../Middleware/Handler/ProcessExitingHandler.ts';
import type { InputReceivedHandlerContract } from '../../Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import { InputReceivedHandler } from '../../Middleware/Handler/InputReceivedHandler.ts';
import type { ThrowableCaughtHandlerContract } from '../../Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import { ThrowableCaughtHandler } from '../../Middleware/Handler/ThrowableCaughtHandler.ts';
import { Router } from '../../Routing/Dispatcher/Router.ts';
import type { RouterContract } from '../../Routing/Dispatcher/Contract/RouterContract.ts';
import { CliInteractionServiceId } from '../../Interaction/Constant/CliInteractionServiceId.ts';
import { Exiter } from '../Support/Exiter.ts';
import type { InputHandlerContract } from './Contract/InputHandlerContract.ts';

export class InputHandler implements InputHandlerContract {
    constructor(
        protected container: ContainerContract = new Container(),
        protected router: RouterContract = new Router(),
        protected inputReceivedHandler: InputReceivedHandlerContract = new InputReceivedHandler(),
        protected throwableCaughtHandler: ThrowableCaughtHandlerContract = new ThrowableCaughtHandler(),
        protected processExitingHandler: ProcessExitingHandlerContract = new ProcessExitingHandler(),
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

        this.container.setSingleton<OutputContract>(CliInteractionServiceId.OutputContract, output);

        return output;
    }

    exit(input: InputContract, output: OutputContract): void {
        this.processExitingHandler.processExiting(input, output);
    }

    run(input: InputContract): void {
        let output = this.handle(input);

        try {
            output = output.writeMessages();
        } catch (throwable: unknown) {
            output = this.getOutputFromThrowable(input, throwable);
            output = this.throwableCaughtHandler.throwableCaught(input, output, throwable);

            try {
                output = output.writeMessages();
            } catch {
                // A middleware can return an output whose destination is the one that failed. This
                // last resort reports the throwable the command's own destination raised.
                output = this.getOutputFromThrowable(input, throwable);
                output = output.writeMessages();
            }

            this.container.setSingleton<OutputContract>(CliInteractionServiceId.OutputContract, output);
        }

        this.exit(input, output);

        this.signalExitCode(output.getExitCode());
    }

    /**
     * Signal the code the process ends with.
     *
     * This lets the process drain, so a stream that buffered a write still sends it. A subclass
     * that must end the process at once overrides this method.
     */
    protected signalExitCode(code: ExitCode | number): void {
        Exiter.setExitCode(code);
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
        const message = throwable instanceof Error ? throwable.message : String(throwable);

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
