/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CliConfig } from '../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { Cli } from '../../../../../src/Valkyrja/Application/Entry/Cli.ts';
import { CliServerServiceId } from '../../../../../src/Valkyrja/Cli/Server/Constant/CliServerServiceId.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

describe('Cli', () => {
    // process.argv always leads with the interpreter path; every vector here is shaped as Node
    // really produces it so the entry point's slice is actually exercised.
    const NODE = '/usr/local/bin/node';

    let originalArgv: string[];

    beforeEach(() => {
        originalArgv = process.argv;
    });

    afterEach(() => {
        process.argv = originalArgv;
        vi.restoreAllMocks();
    });

    it('run starts the application and dispatches the input to the handler', () => {
        process.argv = [NODE, 'cli', 'list'];

        const inputHandler = { run: vi.fn() };
        const container = new Container();
        container.setSingleton(CliServerServiceId.InputHandlerContract, inputHandler);
        const app = { getContainer: () => container, getDebugMode: () => false } as unknown as ApplicationContract;
        vi.spyOn(Cli, 'start').mockReturnValue(app);

        Cli.run(new CliConfig());

        expect(inputHandler.run).toHaveBeenCalledTimes(1);
    });

    it('getInput uses the config defaults when no args are passed', () => {
        process.argv = [];

        const input = Cli.getInput(new CliConfig());

        expect(input.getCaller()).toBe('valkyrja');
        expect(input.getCommandName()).toBe('list');
        expect(input.getArguments()).toHaveLength(0);
        expect(input.getOptions()).toHaveLength(0);
    });

    it('getInput uses a custom application name', () => {
        process.argv = [];

        // applicationName is the 10th constructor argument
        const config = new CliConfig(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'test',
        );

        const input = Cli.getInput(config);

        expect(input.getCaller()).toBe('test');
        expect(input.getCommandName()).toBe('list');
    });

    it('getInput uses a custom default command name', () => {
        process.argv = [];

        // defaultCommandName is the 11th constructor argument
        const config = new CliConfig(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'test',
        );

        const input = Cli.getInput(config);

        expect(input.getCaller()).toBe('valkyrja');
        expect(input.getCommandName()).toBe('test');
    });

    it('getInput parses the caller, command, arguments, and options from argv', () => {
        process.argv = [
            NODE,
            'cli',
            'command',
            '-t',
            '-v=value',
            '--value',
            '--value2=test',
            'argument',
            'argument2',
        ];

        const input = Cli.getInput(new CliConfig());

        expect(input.getCaller()).toBe('cli');
        expect(input.getCommandName()).toBe('command');
        expect(input.getArguments()).toHaveLength(2);
        expect(input.getOptions()).toHaveLength(4);
    });

    it('getInput drops the interpreter path so the script becomes the caller', () => {
        process.argv = [NODE, 'bin/valkyrja', 'app:version'];

        const input = Cli.getInput(new CliConfig());

        expect(input.getCaller()).toBe('bin/valkyrja');
        expect(input.getCommandName()).toBe('app:version');
        expect(input.getArguments()).toHaveLength(0);
    });

    it('getInput falls back to the default command name when only the script is spelled', () => {
        process.argv = [NODE, 'bin/valkyrja'];

        const input = Cli.getInput(new CliConfig());

        expect(input.getCaller()).toBe('bin/valkyrja');
        expect(input.getCommandName()).toBe('list');
    });
});
