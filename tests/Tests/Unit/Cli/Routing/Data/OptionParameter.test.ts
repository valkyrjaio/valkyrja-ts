/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/OptionParameter.ts';
import { OptionMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionMode.ts';
import { OptionValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';
import { CliRoutingInvalidOptionWithValueException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingInvalidOptionWithValueException.ts';
import { CliRoutingOptionValuesValidationException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingOptionValuesValidationException.ts';

describe('OptionParameter', () => {
    it('defaults to an optional, single-value parameter with empty collections', () => {
        const parameter = new OptionParameter('name', 'description');

        expect(parameter.getName()).toBe('name');
        expect(parameter.getShortNames()).toHaveLength(0);
        expect(parameter.getMode()).toBe(OptionMode.OPTIONAL);
        expect(parameter.getValueMode()).toBe(OptionValueMode.DEFAULT);
        expect(parameter.hasValueDisplayName()).toBe(false);
        expect(parameter.hasDefaultValue()).toBe(false);
        expect(parameter.getValidValues()).toHaveLength(0);
        expect(parameter.getOptions()).toHaveLength(0);
    });

    it('manages short names with de-duplication', () => {
        const parameter = new OptionParameter('name', 'description').withShortNames('a');

        expect(parameter.getShortNames()).toStrictEqual(['a']);
        expect(parameter.withAddedShortNames('a', 'b').getShortNames()).toStrictEqual(['a', 'b']);
    });

    it('manages mode, value mode, value display name, and default value immutably', () => {
        const parameter = new OptionParameter('name', 'description');

        expect(parameter.withMode(OptionMode.REQUIRED).getMode()).toBe(OptionMode.REQUIRED);
        expect(parameter.withValueMode(OptionValueMode.ARRAY).getValueMode()).toBe(OptionValueMode.ARRAY);

        const named = parameter.withValueDisplayName('VALUE');
        expect(named.hasValueDisplayName()).toBe(true);
        expect(named.getValueDisplayName()).toBe('VALUE');

        const defaulted = parameter.withDefaultValue('on');
        expect(defaulted.hasDefaultValue()).toBe(true);
        expect(defaulted.getDefaultValue()).toBe('on');
    });

    it('manages valid values with de-duplication', () => {
        const parameter = new OptionParameter('name', 'description').withValidValues('x');

        expect(parameter.getValidValues()).toStrictEqual(['x']);
        expect(parameter.withAddedValidValues('x', 'y').getValidValues()).toStrictEqual(['x', 'y']);
    });

    it('adds options and reports first values', () => {
        const parameter = new OptionParameter('name', 'description');

        expect(parameter.hasFirstValue()).toBe(false);
        expect(parameter.getFirstValue()).toBe('');

        const withOptions = parameter.withOptions(new Option('name', 'a'));
        expect(withOptions.hasFirstValue()).toBe(true);
        expect(withOptions.getFirstValue()).toBe('a');
        expect(withOptions.getCastValues()).toStrictEqual(['a']);
        expect(withOptions.withAddedOptions(new Option('name', 'b')).getOptions()).toHaveLength(2);
    });

    it('rejects options with a value when the value mode is NONE', () => {
        const parameter = new OptionParameter('name', 'description').withValueMode(OptionValueMode.NONE);

        expect(() => parameter.withOptions(new Option('name', 'value'))).toThrow(
            CliRoutingInvalidOptionWithValueException,
        );
        expect(() => parameter.withAddedOptions(new Option('name', 'value'))).toThrow(
            CliRoutingInvalidOptionWithValueException,
        );
        expect(parameter.withOptions(new Option('name')).getOptions()).toHaveLength(1);
    });

    it('validates required and single-value constraints', () => {
        const optional = new OptionParameter('name', 'description');
        expect(optional.areValuesValid()).toBe(true);

        const requiredEmpty = optional.withMode(OptionMode.REQUIRED);
        expect(requiredEmpty.areValuesValid()).toBe(false);

        const tooMany = optional.withOptions(new Option('name', 'a'), new Option('name', 'b'));
        expect(tooMany.areValuesValid()).toBe(false);

        const arrayMode = tooMany.withValueMode(OptionValueMode.ARRAY);
        expect(arrayMode.areValuesValid()).toBe(true);
    });

    it('validateValues returns itself when valid and throws otherwise', () => {
        const valid = new OptionParameter('name', 'description');
        expect(valid.validateValues()).toBe(valid);

        const invalid = valid.withMode(OptionMode.REQUIRED);
        expect(() => invalid.validateValues()).toThrow(CliRoutingOptionValuesValidationException);
    });

    it('enforces valid values against every bound option value', () => {
        const constrained = new OptionParameter('name', 'description').withValidValues('a', 'b');
        const validOption = new Option('name', 'a');
        const validOption2 = new Option('name', 'b');
        const invalidOption = new Option('name', 'c');

        // Empty valid values impose no constraint on the bound value
        expect(new OptionParameter('name', 'description').withOptions(invalidOption).areValuesValid()).toBe(true);
        // A provided value that is a member of the valid values passes
        expect(constrained.withOptions(validOption).areValuesValid()).toBe(true);
        // A provided value that is not a member of the valid values fails
        expect(constrained.withOptions(invalidOption).areValuesValid()).toBe(false);
        // ARRAY: every provided value must be a member of the valid values
        expect(
            constrained.withValueMode(OptionValueMode.ARRAY).withOptions(validOption, validOption2).areValuesValid(),
        ).toBe(true);
        // ARRAY: a single invalid value among several fails
        expect(
            constrained
                .withValueMode(OptionValueMode.ARRAY)
                .withOptions(validOption, validOption2, invalidOption)
                .areValuesValid(),
        ).toBe(false);
        // Non-empty valid values with no bound options impose no failure
        expect(constrained.areValuesValid()).toBe(true);
        // Interaction with REQUIRED: a required, member value passes
        expect(constrained.withMode(OptionMode.REQUIRED).withOptions(validOption).areValuesValid()).toBe(true);
        // Interaction with REQUIRED: a required, non-member value fails
        expect(constrained.withMode(OptionMode.REQUIRED).withOptions(invalidOption).areValuesValid()).toBe(false);
    });

    it('validateValues enforces valid values membership', () => {
        const constrained = new OptionParameter('name', 'description').withValidValues('a', 'b');
        const valid = constrained.withOptions(new Option('name', 'a'));
        const invalid = constrained.withOptions(new Option('name', 'c'));

        expect(valid.validateValues()).toBe(valid);
        expect(() => invalid.validateValues()).toThrow(CliRoutingOptionValuesValidationException);
    });
});
