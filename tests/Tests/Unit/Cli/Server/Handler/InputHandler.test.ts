/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CliInteractionConfig } from '../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { ExitCode } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/ExitCode.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Output } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { FileOutput } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/FileOutput.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { OutputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { InputHandler } from '../../../../../../src/Valkyrja/Cli/Server/Handler/InputHandler.ts';
import { CliInteractionServiceId } from '../../../../../../src/Valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { Exiter } from '../../../../../../src/Valkyrja/Cli/Server/Support/Exiter.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { InputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { ProcessExitingHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ProcessExitingHandlerContract.ts';
import type { InputReceivedHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';
import type { ThrowableCaughtHandlerContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';
import type { RouterContract } from '../../../../../../src/Valkyrja/Cli/Routing/Dispatcher/Contract/RouterContract.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

// The full report reads the command name, so this input makes that report throw.
const raisingInput = {
    getCommandName: (): string => {
        throw new Error('input');
    },
} as unknown as InputContract;

const passInput = {
    inputReceived: (input: InputContract): InputContract => input,
} as unknown as InputReceivedHandlerContract;
const passThrowable = {
    throwableCaught: (_input: InputContract, output: OutputContract): OutputContract => output,
} as unknown as ThrowableCaughtHandlerContract;

function build(overrides: {
    router?: RouterContract;
    inputReceivedHandler?: InputReceivedHandlerContract;
    processExitingHandler?: ProcessExitingHandlerContract;
    throwableCaughtHandler?: ThrowableCaughtHandlerContract;
    outputFactory?: OutputFactory;
}): { handler: InputHandler; container: Container } {
    const container = new Container();
    const handler = new InputHandler(
        container,
        overrides.router ?? ({ dispatch: () => new Output() } as unknown as RouterContract),
        overrides.inputReceivedHandler ?? passInput,
        overrides.throwableCaughtHandler ?? passThrowable,
        overrides.processExitingHandler ?? ({ processExiting: vi.fn() } as unknown as ProcessExitingHandlerContract),
        new CliInteractionConfig(),
        overrides.outputFactory ?? new OutputFactory(),
    );

    return { handler, container };
}

// The suite itself ends with process.exitCode, so each test restores the code it found.
let originalExitCode: typeof process.exitCode;

beforeEach(() => {
    originalExitCode = process.exitCode;
    Exiter.freeze();
});
afterEach(() => {
    process.exitCode = originalExitCode;
    Exiter.unfreeze();
    // mockClear leaves a once implementation queued, and only mockReset drops it.
    stdoutSpy.mockReset();
    stdoutSpy.mockImplementation(() => true);
});

describe('InputHandler', () => {
    it('registers the written output on the success path', () => {
        const output = new Output().withIsSilent(true).withAddedMessage(new Message('hi'));
        const { handler, container } = build({ router: { dispatch: () => output } as unknown as RouterContract });

        handler.run(new Input('cli', 'build'));

        const registered = container.getSingleton<OutputContract>(CliInteractionServiceId.OutputContract);

        expect(registered).not.toBe(output);
        expect(registered.hasWrittenMessage()).toBe(true);
        expect(registered.hasUnwrittenMessage()).toBe(false);
    });

    it('sets the process exit code and does not end the process', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const { handler } = build({
            router: { dispatch: () => new Output().withExitCode(ExitCode.SUCCESS) } as unknown as RouterContract,
        });

        handler.run(new Input('cli', 'build'));

        expect(process.exitCode).toBe(ExitCode.SUCCESS);
        expect(exitSpy).not.toHaveBeenCalled();

        exitSpy.mockRestore();
    });

    it('recovers when the dispatch middleware throws inside handle', () => {
        const { handler, container } = build({
            router: {
                dispatch: () => {
                    throw new Error('route');
                },
            } as unknown as RouterContract,
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract => {
                    throw new Error('middleware');
                },
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Recovery message:'));
        expect(container.getSingleton<OutputContract>(CliInteractionServiceId.OutputContract).getExitCode()).toBe(
            ExitCode.ERROR,
        );
    });

    it('reports a recovery throwable that is not an Error, and does not raise', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new Error('route');
                },
            } as unknown as RouterContract,
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract => {
                    // A self-referencing object carries no message of its own.
                    const circular: Record<string, unknown> = {};
                    circular['self'] = circular;

                    // eslint-disable-next-line @typescript-eslint/only-throw-error
                    throw circular;
                },
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('[object Object]'));
    });

    it('reports the text of a recovery throwable that carries its own toString', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new Error('route');
                },
            } as unknown as RouterContract,
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract => {
                    // eslint-disable-next-line @typescript-eslint/only-throw-error
                    throw new (class {
                        toString(): string {
                            return 'driver failed';
                        }
                    })();
                },
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('driver failed'));
    });

    it('reports a recovery throwable whose toString raises, and does not raise', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new Error('route');
                },
            } as unknown as RouterContract,
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract => {
                    throw Object.create(null);
                },
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('the throwable reports no message'));
    });

    it('takes the last resort when the full report throws', () => {
        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        const { handler } = build({
            router: {
                dispatch: () => new FileOutput(unwritable).withAddedMessage(new Message('hello')),
            } as unknown as RouterContract,
        });

        expect(() => {
            handler.run(raisingInput);
        }).not.toThrow();
        // The last resort reads no input, so it names both throwables and no command.
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Recovery message:'));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('input'));
        expect(stdoutSpy).not.toHaveBeenCalledWith(expect.stringContaining('Command:'));
    });

    it('reports through the fallback when the dispatch report throws inside handle', () => {
        const { handler, container } = build({
            router: {
                dispatch: () => {
                    throw new Error('route');
                },
            } as unknown as RouterContract,
        });

        const output = handler.handle(raisingInput);

        expect(output.getExitCode()).toBe(ExitCode.ERROR);
        expect(container.getSingleton<OutputContract>(CliInteractionServiceId.OutputContract)).toBe(output);

        output.writeMessages();

        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('route'));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('input'));
    });

    it('signals the exit code when the report of the exit stage throwable throws', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const { handler } = build({
            router: { dispatch: () => new Output().withExitCode(ExitCode.USAGE_ERROR) } as unknown as RouterContract,
            processExitingHandler: {
                processExiting: (): void => {
                    throw new Error('exiting');
                },
            } as unknown as ProcessExitingHandlerContract,
        });

        expect(() => {
            handler.run(raisingInput);
        }).not.toThrow();
        // The full report reads the input, so the report that reads nothing takes its place.
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('exiting'));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('input'));
        expect(process.exitCode).toBe(ExitCode.USAGE_ERROR);

        exitSpy.mockRestore();
    });

    it('signals the exit code when every report of the exit stage throwable fails', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const { handler } = build({
            router: {
                dispatch: () => new Output().withIsSilent(true).withExitCode(ExitCode.USAGE_ERROR),
            } as unknown as RouterContract,
            processExitingHandler: {
                processExiting: (): void => {
                    throw new Error('exiting');
                },
            } as unknown as ProcessExitingHandlerContract,
        });

        // The command writes nothing, so the first write is the report that reads no input.
        stdoutSpy.mockImplementationOnce(() => {
            throw new Error('stdout');
        });

        expect(() => {
            handler.run(raisingInput);
        }).not.toThrow();
        expect(process.exitCode).toBe(ExitCode.USAGE_ERROR);

        exitSpy.mockRestore();
    });

    it('signals the exit code when the process exiting middleware throws', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const { handler } = build({
            router: { dispatch: () => new Output().withExitCode(ExitCode.ERROR) } as unknown as RouterContract,
            processExitingHandler: {
                processExiting: (): void => {
                    throw new Error('exiting');
                },
            } as unknown as ProcessExitingHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(process.exitCode).toBe(ExitCode.ERROR);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('exiting'));

        exitSpy.mockRestore();
    });

    it('signals the exit code when the report of the exit stage throwable also fails', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const { handler } = build({
            router: {
                dispatch: () => new Output().withIsSilent(true).withExitCode(ExitCode.USAGE_ERROR),
            } as unknown as RouterContract,
            processExitingHandler: {
                processExiting: (): void => {
                    throw new Error('exiting');
                },
            } as unknown as ProcessExitingHandlerContract,
        });

        // The command writes nothing, so only the report of the exit throwable reaches stdout.
        stdoutSpy.mockImplementationOnce(() => {
            throw new Error('stdout');
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        // The first report's own write throws before it reaches its command line. The report
        // that answers it names the command, because the input reads.
        const commandWrites = stdoutSpy.mock.calls.filter((call) => String(call[0]).includes('Command:'));
        expect(commandWrites).toHaveLength(1);
        // An uncaught throwable ends the process with 1, so the code the command computed
        // reaches the shell only while run stays total.
        expect(process.exitCode).toBe(ExitCode.USAGE_ERROR);

        exitSpy.mockRestore();
    });

    it('signals the exit code when the last resort of the write path also fails', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        const { handler, container } = build({
            router: {
                dispatch: () =>
                    new FileOutput(unwritable)
                        .withExitCode(ExitCode.USAGE_ERROR)
                        .withAddedMessage(new Message('hello')),
            } as unknown as RouterContract,
            // The middleware routes the recovery output back to the destination that failed.
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract =>
                    new FileOutput(unwritable).withAddedMessage(new Message('recovery')),
            } as unknown as ThrowableCaughtHandlerContract,
        });

        stdoutSpy.mockImplementation(() => {
            throw new Error('stdout');
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();

        stdoutSpy.mockReset();
        stdoutSpy.mockImplementation(() => true);

        expect(process.exitCode).toBe(ExitCode.ERROR);
        expect(container.getSingleton<OutputContract>(CliInteractionServiceId.OutputContract).getExitCode()).toBe(
            ExitCode.ERROR,
        );

        exitSpy.mockRestore();
    });

    it('recovers when the throwable caught middleware itself throws', () => {
        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        const { handler, container } = build({
            router: {
                dispatch: () => new FileOutput(unwritable).withAddedMessage(new Message('hello')),
            } as unknown as RouterContract,
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract => {
                    throw new Error('middleware');
                },
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));
        expect(container.getSingleton<OutputContract>(CliInteractionServiceId.OutputContract).getExitCode()).toBe(
            ExitCode.ERROR,
        );
    });

    it('falls back to a printing output when the recovery write also fails', () => {
        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        const { handler } = build({
            router: {
                dispatch: () => new FileOutput(unwritable).withAddedMessage(new Message('hello')),
            } as unknown as RouterContract,
            // The middleware routes the recovery output back to the destination that failed.
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract =>
                    new FileOutput(unwritable).withAddedMessage(new Message('recovery')),
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));
        // The input reads, so the report that answers a failed report still names the command.
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Command:'));
    });

    it('writes the recovery report on a silent run, where the first writes nothing', () => {
        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        // The factory copies the silent flag, so every report it builds writes nothing.
        const { handler } = build({
            outputFactory: new OutputFactory(new CliInteractionConfig(false, true, true)),
            router: {
                dispatch: () => new FileOutput(unwritable).withAddedMessage(new Message('hello')),
            } as unknown as RouterContract,
            throwableCaughtHandler: {
                throwableCaught: (): OutputContract => {
                    throw new Error('middleware');
                },
            } as unknown as ThrowableCaughtHandlerContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        // The recovery report takes an output this handler builds, with the default flags.
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));
    });

    it('writes no first report on a silent run', () => {
        const unwritable = '/nonexistent-valkyrja-dir/out.log';
        // The factory copies the silent flag, so the report it builds writes nothing.
        const { handler, container } = build({
            outputFactory: new OutputFactory(new CliInteractionConfig(false, true, true)),
            router: {
                dispatch: () => new FileOutput(unwritable).withAddedMessage(new Message('hello')),
            } as unknown as RouterContract,
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        // The command's write failed, so the recovery arm ran and its report replaced the
        // output. The middleware passes that silent report through, so nothing reaches stdout.
        const registered = container.getSingleton<OutputContract>(CliInteractionServiceId.OutputContract);
        expect(registered.getExitCode()).toBe(ExitCode.ERROR);
        expect(registered).not.toBeInstanceOf(FileOutput);
        expect(stdoutSpy).not.toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));
    });

    it('signals the error code when the output throws on its own code', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        // An output supplies the code, and this one throws on the read.
        const raising = new Output();
        raising.getExitCode = (): ExitCode => {
            throw new Error('exit code');
        };

        const { handler } = build({ router: { dispatch: () => raising } as unknown as RouterContract });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        // The guard names what it swallowed rather than leaving the run no trace, and the
        // input reads, so the report names the command.
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('exit code'));
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Command:'));
        expect(process.exitCode).toBe(ExitCode.ERROR);

        exitSpy.mockRestore();
    });

    it('signals the error code when the report of the code read also fails', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        const raising = new Output().withIsSilent(true);
        raising.getExitCode = (): ExitCode => {
            throw new Error('exit code');
        };

        const { handler } = build({ router: { dispatch: () => raising } as unknown as RouterContract });

        // The command writes nothing, so the first write is the report of the code read.
        stdoutSpy.mockImplementationOnce(() => {
            throw new Error('stdout');
        });

        expect(() => {
            handler.run(new Input('cli', 'build'));
        }).not.toThrow();
        expect(process.exitCode).toBe(ExitCode.ERROR);

        exitSpy.mockRestore();
    });

    it('signals the error code when the output holds a code process.exitCode refuses', () => {
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
        Exiter.unfreeze();

        // process.exitCode raises on a fractional code and on one past the safe range.
        for (const code of [1.5, Number.MAX_SAFE_INTEGER + 2]) {
            const { handler } = build({
                router: { dispatch: () => new Output().withExitCode(code) } as unknown as RouterContract,
            });

            expect(() => {
                handler.run(new Input('cli', 'build'));
            }).not.toThrow();
            // The substitution names the code it refused rather than passing in silence.
            expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining(`takes no exit code ${String(code)}`));
            expect(process.exitCode).toBe(ExitCode.ERROR);
        }

        exitSpy.mockRestore();
    });

    it('dispatches the router and stores the output', () => {
        const output = new Output();
        const { handler, container } = build({ router: { dispatch: () => output } as unknown as RouterContract });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result).toBe(output);
        expect(container.getSingleton(CliInteractionServiceId.OutputContract)).toBe(output);
    });

    it('short-circuits when input-received middleware returns an output', () => {
        const middlewareOutput = new Output();
        const dispatch = vi.fn();
        const { handler } = build({
            router: { dispatch } as unknown as RouterContract,
            inputReceivedHandler: {
                inputReceived: (): OutputContract => middlewareOutput,
            } as unknown as InputReceivedHandlerContract,
        });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result).toBe(middlewareOutput);
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('builds an error output when dispatch throws an Error', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    throw new Error('boom');
                },
            } as unknown as RouterContract,
        });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });

    it('builds an error output when dispatch throws a non-Error', () => {
        const { handler } = build({
            router: {
                dispatch: () => {
                    // Throwing a non-Error is the whole point of this case: it proves the
                    // handler wraps it.
                    // eslint-disable-next-line @typescript-eslint/only-throw-error
                    throw 'oops';
                },
            } as unknown as RouterContract,
        });

        const result = handler.handle(new Input('cli', 'build'));

        expect(result.getExitCode()).toBe(ExitCode.ERROR);
    });

    it('exit delegates to the processExiting handler', () => {
        const processExiting = vi.fn();
        const { handler } = build({
            processExitingHandler: { processExiting } as unknown as ProcessExitingHandlerContract,
        });

        handler.exit(new Input('cli', 'build'), new Output());

        expect(processExiting).toHaveBeenCalledTimes(1);
    });

    it('run handles, writes, exits, and signals the exit code', () => {
        const processExiting = vi.fn();
        const output = new Output();
        const writeSpy = vi.spyOn(output, 'writeMessages');
        const { handler } = build({
            router: { dispatch: () => output } as unknown as RouterContract,
            processExitingHandler: { processExiting } as unknown as ProcessExitingHandlerContract,
        });

        handler.run(new Input('cli', 'build'));

        expect(writeSpy).toHaveBeenCalledTimes(1);
        expect(processExiting).toHaveBeenCalledTimes(1);
        expect(stdoutSpy).toHaveBeenCalledWith(String(ExitCode.SUCCESS));
    });

    it('run routes a write throwable through the throwable caught handler', () => {
        const processExiting = vi.fn();
        const unwritable = new FileOutput('/nonexistent-valkyrja-dir/out.log').withAddedMessage(new Message('hello'));
        const { handler } = build({
            router: { dispatch: () => unwritable } as unknown as RouterContract,
            processExitingHandler: { processExiting } as unknown as ProcessExitingHandlerContract,
        });

        handler.run(new Input('cli', 'build'));

        expect(processExiting).toHaveBeenCalledTimes(1);
        expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Cli Server Error:'));
        expect(stdoutSpy).toHaveBeenCalledWith(String(ExitCode.ERROR));
    });
});
