/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import type { ArgumentContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Contract/ArgumentContract.ts';
import type { OptionContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Contract/OptionContract.ts';
import { OptionType } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/OptionType.ts';
import { InputFactory } from '../../../../../../src/Valkyrja/Cli/Interaction/Input/Factory/InputFactory.ts';
import { CliInteractionInvalidEmptyValueException } from '../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionInvalidEmptyValueException.ts';
import { CliInteractionInvalidNonEmptyValueException } from '../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionInvalidNonEmptyValueException.ts';

const DEFAULT_CALLER = 'valkyrja';
const DEFAULT_COMMAND = 'list';

type OptionTuple = [string, string, OptionType];

const argumentValues = (arguments_: ArgumentContract[]): string[] => arguments_.map((argument) => argument.getValue());

const optionTuples = (options: OptionContract[]): OptionTuple[] =>
    options.map((option) => [option.getName(), option.getValue(), option.getType()]);

/** Every option spelling the factory supports. */
const optionSpellings: Array<[string, string[], OptionTuple[]]> = [
    ['long with value', ['valkyrja', 'cmd', '--name=value'], [['name', 'value', OptionType.LONG]]],
    ['long without value', ['valkyrja', 'cmd', '--verbose'], [['verbose', '', OptionType.LONG]]],
    ['long with empty value', ['valkyrja', 'cmd', '--name='], [['name', '', OptionType.LONG]]],
    ['short without value', ['valkyrja', 'cmd', '-v'], [['v', '', OptionType.SHORT]]],
    ['short with value', ['valkyrja', 'cmd', '-n=value'], [['n', 'value', OptionType.SHORT]]],
    [
        'bundled short flags',
        ['valkyrja', 'cmd', '-abc'],
        [
            ['a', '', OptionType.SHORT],
            ['b', '', OptionType.SHORT],
            ['c', '', OptionType.SHORT],
        ],
    ],
    [
        'repeated long option',
        ['valkyrja', 'cmd', '--tag=one', '--tag=two'],
        [
            ['tag', 'one', OptionType.LONG],
            ['tag', 'two', OptionType.LONG],
        ],
    ],
    [
        'mixed long and short',
        ['valkyrja', 'cmd', '--name=value', '-v', '-ab'],
        [
            ['name', 'value', OptionType.LONG],
            ['v', '', OptionType.SHORT],
            ['a', '', OptionType.SHORT],
            ['b', '', OptionType.SHORT],
        ],
    ],
    ['value containing equals', ['valkyrja', 'cmd', '--expr=a=b'], [['expr', 'a', OptionType.LONG]]],
];

/** Spellings the factory rejects, each with the exact throwable it raises. */
const rejectedSpellings: Array<[string, string[], new (...args: never[]) => Error]> = [
    ['double dash terminator', ['valkyrja', 'cmd', '--'], CliInteractionInvalidNonEmptyValueException],
    ['single dash', ['valkyrja', 'cmd', '-'], CliInteractionInvalidNonEmptyValueException],
    ['bundled short with value', ['valkyrja', 'cmd', '-abc=value'], CliInteractionInvalidEmptyValueException],
];

/**
 * Message-mapping fidelity for an incoming CLI command.
 *
 * Asserts that an argv-style array lands on the framework's own Input,
 * Argument, and Option objects exactly as spelled, independent of routing.
 */
describe('Input mapping (functional)', () => {
    it('maps the caller and command name from argv', () => {
        const input = InputFactory.fromGlobals(['bin/valkyrja', 'app:version'], DEFAULT_CALLER, DEFAULT_COMMAND);

        expect(input.getCaller()).toBe('bin/valkyrja');
        expect(input.getCommandName()).toBe('app:version');
        expect(input.getArguments()).toStrictEqual([]);
        expect(input.getOptions()).toStrictEqual([]);
    });

    it('applies the supplied defaults when argv is bare', () => {
        const input = InputFactory.fromGlobals(['bin/valkyrja'], DEFAULT_CALLER, DEFAULT_COMMAND);

        expect(input.getCaller()).toBe('bin/valkyrja');
        expect(input.getCommandName()).toBe(DEFAULT_COMMAND);

        const empty = InputFactory.fromGlobals([], DEFAULT_CALLER, DEFAULT_COMMAND);

        expect(empty.getCaller()).toBe(DEFAULT_CALLER);
        expect(empty.getCommandName()).toBe(DEFAULT_COMMAND);
    });

    it('maps positional arguments in argv order', () => {
        const input = InputFactory.fromGlobals(
            ['valkyrja', 'app:copy', 'source.txt', 'target.txt', 'third'],
            DEFAULT_CALLER,
            DEFAULT_COMMAND,
        );

        expect(input.getCommandName()).toBe('app:copy');
        expect(argumentValues(input.getArguments())).toStrictEqual(['source.txt', 'target.txt', 'third']);
    });

    it('interleaves options and positional arguments without disturbing either order', () => {
        const input = InputFactory.fromGlobals(
            ['valkyrja', 'app:copy', 'source.txt', '--force', 'target.txt', '-v'],
            DEFAULT_CALLER,
            DEFAULT_COMMAND,
        );

        expect(argumentValues(input.getArguments())).toStrictEqual(['source.txt', 'target.txt']);
        expect(optionTuples(input.getOptions())).toStrictEqual([
            ['force', '', OptionType.LONG],
            ['v', '', OptionType.SHORT],
        ]);
    });

    it.each(optionSpellings)('maps the %s spelling onto options', (_label, args, expected) => {
        const input = InputFactory.fromGlobals(args, DEFAULT_CALLER, DEFAULT_COMMAND);

        expect(input.getCommandName()).toBe('cmd');
        expect(optionTuples(input.getOptions())).toStrictEqual(expected);
    });

    it.each(rejectedSpellings)('rejects the %s spelling', (_label, args, expected) => {
        expect(() => InputFactory.fromGlobals(args, DEFAULT_CALLER, DEFAULT_COMMAND)).toThrow(expected);
    });

    it('reflects whether a value was spelled out', () => {
        const input = InputFactory.fromGlobals(
            ['valkyrja', 'cmd', '--with=value', '--without'],
            DEFAULT_CALLER,
            DEFAULT_COMMAND,
        );

        const [withValue, withoutValue] = input.getOptions();

        expect(withValue?.hasValue()).toBe(true);
        expect(withValue?.getValue()).toBe('value');
        expect(withoutValue?.hasValue()).toBe(false);
        expect(withoutValue?.getValue()).toBe('');
    });

    it('preserves a repeated option once per occurrence and looks it up by name', () => {
        const input = InputFactory.fromGlobals(
            ['valkyrja', 'cmd', '--tag=one', '--tag=two', '--other=x'],
            DEFAULT_CALLER,
            DEFAULT_COMMAND,
        );

        expect(input.hasOption('tag')).toBe(true);
        expect(input.hasOption('other')).toBe(true);
        expect(input.hasOption('missing')).toBe(false);
        expect(input.getOption('missing')).toStrictEqual([]);

        const tags = input.getOption('tag');

        expect(tags).toHaveLength(2);
        expect(tags[0]?.getValue()).toBe('one');
        expect(tags[1]?.getValue()).toBe('two');
    });

    it('leaves the default command name when an option is spelled before it', () => {
        const input = InputFactory.fromGlobals(
            ['valkyrja', '--verbose', 'app:version'],
            DEFAULT_CALLER,
            DEFAULT_COMMAND,
        );

        expect(input.getCommandName()).toBe(DEFAULT_COMMAND);
        expect(argumentValues(input.getArguments())).toStrictEqual(['app:version']);
        expect(input.hasOption('verbose')).toBe(true);
    });

    it('turns a space-separated option value into a positional argument', () => {
        const input = InputFactory.fromGlobals(['valkyrja', 'cmd', '--name', 'value'], DEFAULT_CALLER, DEFAULT_COMMAND);

        expect(argumentValues(input.getArguments())).toStrictEqual(['value']);
        expect(optionTuples(input.getOptions())).toStrictEqual([['name', '', OptionType.LONG]]);
    });
});
