/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { CliConfig } from '../../../../../src/Valkyrja/Application/Data/CliConfig.ts';
import { Cli } from '../../../../../src/Valkyrja/Application/Entry/Cli.ts';

describe('Cli', () => {
    let originalArgv: string[];

    beforeEach(() => {
        originalArgv = process.argv;
    });

    afterEach(() => {
        process.argv = originalArgv;
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
        process.argv = ['cli', 'command', '-t', '-v=value', '--value', '--value2=test', 'argument', 'argument2'];

        const input = Cli.getInput(new CliConfig());

        expect(input.getCaller()).toBe('cli');
        expect(input.getCommandName()).toBe('command');
        expect(input.getArguments()).toHaveLength(2);
        expect(input.getOptions()).toHaveLength(4);
    });
});
