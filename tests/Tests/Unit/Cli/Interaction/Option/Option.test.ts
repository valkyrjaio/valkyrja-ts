/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { OptionType } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/OptionType.ts';
import { OptionContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Contract/OptionContract.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';

describe('Option', () => {
    it('defaults to an empty value and a long type', () => {
        const option = new Option('verbose');

        expect(option.getName()).toBe('verbose');
        expect(option.getValue()).toBe('');
        expect(option.hasValue()).toBe(false);
        expect(option.getType()).toBe(OptionType.LONG);
    });

    it('reports having a value when one is set', () => {
        const option = new Option('name', 'value', OptionType.SHORT);

        expect(option.hasValue()).toBe(true);
        expect(option.getValue()).toBe('value');
        expect(option.getType()).toBe(OptionType.SHORT);
    });

    it('withName returns an immutable clone with the new name', () => {
        const option = new Option('name');
        const next = option.withName('other');

        expect(next).not.toBe(option);
        expect(option.getName()).toBe('name');
        expect(next.getName()).toBe('other');
    });

    it('withValue and withoutValue return immutable clones', () => {
        const option = new Option('name');

        const withValue = option.withValue('value');
        expect(withValue).not.toBe(option);
        expect(withValue.getValue()).toBe('value');

        const withoutValue = withValue.withoutValue();
        expect(withoutValue).not.toBe(withValue);
        expect(withoutValue.getValue()).toBe('');
    });

    it('withType returns an immutable clone with the new type', () => {
        const option = new Option('name');
        const next = option.withType(OptionType.SHORT);

        expect(next).not.toBe(option);
        expect(option.getType()).toBe(OptionType.LONG);
        expect(next.getType()).toBe(OptionType.SHORT);
    });

    it('instanceOf is true for an Option and false otherwise', () => {
        expect(OptionContract.instanceOf(new Option('name'))).toBe(true);
        expect(OptionContract.instanceOf(null)).toBe(false);
        expect(OptionContract.instanceOf({})).toBe(false);
    });
});
