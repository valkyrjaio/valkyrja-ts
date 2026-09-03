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
import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.ts';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.ts';
import { Output } from '../../Interaction/Output/Output.ts';
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
            try {
                // A middleware runs here, so the dispatch belongs under a guard of its own.
                output = this.getOutputFromThrowable(input, throwable);
                output = this.throwableCaughtHandler.throwableCaught(input, output, throwable);
            } catch (recoveryThrowable: unknown) {
                output = this.getRecoveryOutput(input, throwable, recoveryThrowable);
            }
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
            try {
                // A middleware runs here, so the dispatch belongs under the same guard as the write.
                output = this.getOutputFromThrowable(input, throwable);
                output = this.throwableCaughtHandler.throwableCaught(input, output, throwable);
                output = output.writeMessages();
            } catch (recoveryThrowable: unknown) {
                // The dispatch or the recovery write failed. A middleware can throw, or it can
                // return an output whose destination is the one that failed.
                output = this.getRecoveryOutput(input, throwable, recoveryThrowable);

                try {
                    output = output.writeMessages();
                } catch {
                    // The report is the last write, so a failure here leaves no trace to write.
                }
            }
        }

        this.container.setSingleton<OutputContract>(CliInteractionServiceId.OutputContract, output);

        try {
            this.exit(input, output);
        } catch (exitThrowable: unknown) {
            try {
                // A middleware runs here, and the command's code still reaches the shell, so this
                // report is the only trace the failure leaves.
                this.getOutputFromThrowable(input, exitThrowable).writeMessages();
            } catch (reportThrowable: unknown) {
                try {
                    this.getRecoveryOutput(input, exitThrowable, reportThrowable).writeMessages();
                } catch {
                    // The report is the last write, so a failure here leaves no trace to write.
                }
            }
        }

        this.signalExitCode(this.getExitCode(input, output));
    }

    /**
     * Read the code an output ends the process with.
     *
     * An output supplies this value, and a contract implementation can throw on the read. The
     * code must reach the shell either way.
     */
    protected getExitCode(input: InputContract, output: OutputContract): ExitCode | number {
        let exitCode: ExitCode | number;

        try {
            exitCode = output.getExitCode();
        } catch (codeThrowable: unknown) {
            try {
                // This read runs last, so the report is the only trace the failure leaves.
                this.getRecoveryOutput(input, codeThrowable).writeMessages();
            } catch {
                // The report is the last write, so a failure here leaves no trace to write.
            }

            return ExitCode.ERROR;
        }

        // process.exitCode takes a safe integer, and Node raises ERR_OUT_OF_RANGE on any
        // other number. That assignment runs after every guard this method sits behind.
        return Number.isSafeInteger(exitCode) ? exitCode : ExitCode.ERROR;
    }

    /**
     * Signal the code the process ends with.
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
        return this.outputFactory
            .createOutput(ExitCode.ERROR)
            .withMessages(...this.getThrowableMessages(input, throwable));
    }

    /**
     * Build the messages that report a throwable.
     */
    protected getThrowableMessages(input: InputContract, throwable: unknown): MessageContract[] {
        return [
            new Banner(new ErrorMessage('Cli Server Error:')),
            new NewLine(),
            new ErrorMessage('Command:'),
            new Message(` ${input.getCommandName()}`),
            new NewLine(),
            new NewLine(),
            new ErrorMessage('Message:'),
            new Message(` ${this.getThrowableMessage(throwable)}`),
            // The report ends the line it wrote, so the shell prompt does not land on it.
            new NewLine(),
        ];
    }

    /**
     * Build a second report, which names the throwable a first report answered and the throwable
     * that ended the first recovery.
     *
     * The output it builds takes the default interaction flags rather than the configured ones,
     * so no run suppresses this report.
     */
    protected getRecoveryOutput(input: InputContract, throwable: unknown, recoveryThrowable?: unknown): OutputContract {
        const recoveryMessages = recoveryThrowable === undefined ? [] : this.getRecoveryMessages(recoveryThrowable);
        let messages: MessageContract[];

        try {
            messages = [...this.getThrowableMessages(input, throwable), ...recoveryMessages];
        } catch {
            // The full report reads the command name from the input, so an input that throws
            // there takes the report with it.
            messages = [...this.getBareThrowableMessages(throwable), ...recoveryMessages];
        }

        return new Output().withExitCode(ExitCode.ERROR).withMessages(...messages);
    }

    /**
     * Build the messages that report the throwable a recovery threw.
     */
    protected getRecoveryMessages(recoveryThrowable: unknown): MessageContract[] {
        return [
            new NewLine(),
            new ErrorMessage('Recovery message:'),
            new Message(` ${this.getThrowableMessage(recoveryThrowable)}`),
            new NewLine(),
        ];
    }

    /**
     * Build the messages that report two throwables without reading the input.
     */
    /**
     * Build the messages that report one throwable without reading the input.
     */
    protected getBareThrowableMessages(throwable: unknown): MessageContract[] {
        return [
            new Banner(new ErrorMessage('Cli Server Error:')),
            new NewLine(),
            new ErrorMessage('Message:'),
            new Message(` ${this.getThrowableMessage(throwable)}`),
            new NewLine(),
        ];
    }

    protected getThrowableMessage(throwable: unknown): string {
        if (throwable instanceof Error) {
            return throwable.message;
        }

        try {
            return String(throwable);
        } catch {
            // A report must not raise, and a throwable can carry a toString that raises. This
            // method runs again on the same throwable in each recovery arm.
            return 'the throwable reports no message';
        }
    }

    protected isOutputContract(value: InputContract | OutputContract): value is OutputContract {
        return 'writeMessages' in value;
    }
}
