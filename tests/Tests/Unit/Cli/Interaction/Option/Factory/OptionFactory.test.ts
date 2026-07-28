/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { OptionType } from '../../../../../../../src/Valkyrja/Cli/Interaction/Enum/OptionType.ts';
import { OptionFactory } from '../../../../../../../src/Valkyrja/Cli/Interaction/Option/Factory/OptionFactory.ts';
import { CliInteractionInvalidEmptyValueException } from '../../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionInvalidEmptyValueException.ts';
import { CliInteractionInvalidNonEmptyValueException } from '../../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionInvalidNonEmptyValueException.ts';
import { CliInteractionInvalidOptionNameException } from '../../../../../../../src/Valkyrja/Cli/Interaction/Throwable/Exception/CliInteractionInvalidOptionNameException.ts';

describe('OptionFactory', () => {
    it('parses a long option with a value', () => {
        const [option] = OptionFactory.fromArg('--name=value');

        expect(option?.getName()).toBe('name');
        expect(option?.getValue()).toBe('value');
        expect(option?.getType()).toBe(OptionType.LONG);
    });

    it('keeps an equals sign inside the value', () => {
        const [option] = OptionFactory.fromArg('--expr=a=b');

        expect(option?.getName()).toBe('expr');
        expect(option?.getValue()).toBe('a=b');
        expect(option?.getType()).toBe(OptionType.LONG);
    });

    it('keeps every equals sign inside a longer value', () => {
        const [option] = OptionFactory.fromArg('--filter=name=a=b');

        expect(option?.getName()).toBe('filter');
        expect(option?.getValue()).toBe('name=a=b');
    });

    it('parses a long option without a value', () => {
        const [option] = OptionFactory.fromArg('--name');

        expect(option?.getName()).toBe('name');
        expect(option?.getValue()).toBe('');
        expect(option?.getType()).toBe(OptionType.LONG);
    });

    it('parses a single short option with a value', () => {
        const [option] = OptionFactory.fromArg('-v=value');

        expect(option?.getName()).toBe('v');
        expect(option?.getValue()).toBe('value');
        expect(option?.getType()).toBe(OptionType.SHORT);
    });

    it('splits combined short options', () => {
        const options = OptionFactory.fromArg('-abc');

        expect(options).toHaveLength(3);
        expect(options.map((option) => option.getName())).toStrictEqual(['a', 'b', 'c']);
        expect(options.every((option) => option.getType() === OptionType.SHORT)).toBe(true);
    });

    it('throws when an arg does not begin with a dash', () => {
        expect(() => OptionFactory.fromArg('value')).toThrow(CliInteractionInvalidOptionNameException);
    });

    it('throws when the option name is empty', () => {
        expect(() => OptionFactory.fromArg('--')).toThrow(CliInteractionInvalidNonEmptyValueException);
    });

    it('throws when combining short options with a value', () => {
        expect(() => OptionFactory.fromArg('-abc=value')).toThrow(CliInteractionInvalidEmptyValueException);
    });
});
