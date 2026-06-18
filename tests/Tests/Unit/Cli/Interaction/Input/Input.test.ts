/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Argument } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Argument.ts';
import { Input } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';

describe('Input', () => {
    it('uses the framework defaults', () => {
        const input = new Input();

        expect(input.getCaller()).toBe('valkyrja');
        expect(input.getCommandName()).toBe('list');
        expect(input.getArguments()).toHaveLength(0);
        expect(input.getOptions()).toHaveLength(0);
    });

    it('withCaller and withCommandName return immutable clones', () => {
        const input = new Input();

        expect(input.withCaller('cli').getCaller()).toBe('cli');
        expect(input.withCommandName('build').getCommandName()).toBe('build');
        expect(input.getCaller()).toBe('valkyrja');
    });

    it('manages arguments immutably', () => {
        const input = new Input().withArguments(new Argument('a'), new Argument('b'));

        expect(input.getArguments()).toHaveLength(2);
        expect(input.withAddedArgument(new Argument('c')).getArguments()).toHaveLength(3);
        expect(
            input
                .withoutArgument('a')
                .getArguments()
                .map((a) => a.getValue()),
        ).toStrictEqual(['b']);
        expect(input.withoutArguments().getArguments()).toHaveLength(0);
    });

    it('manages options immutably and supports lookups', () => {
        const input = new Input().withOptions(new Option('verbose'), new Option('verbose'), new Option('quiet'));

        expect(input.getOptions()).toHaveLength(3);
        expect(input.getOption('verbose')).toHaveLength(2);
        expect(input.hasOption('quiet')).toBe(true);
        expect(input.hasOption('missing')).toBe(false);
        expect(input.withAddedOption(new Option('debug')).getOptions()).toHaveLength(4);
        expect(
            input
                .withoutOption('verbose')
                .getOptions()
                .map((o) => o.getName()),
        ).toStrictEqual(['quiet']);
        expect(input.withoutOptions().getOptions()).toHaveLength(0);
    });
});
