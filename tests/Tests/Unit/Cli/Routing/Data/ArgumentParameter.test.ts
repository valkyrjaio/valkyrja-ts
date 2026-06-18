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
import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/ArgumentParameter.ts';
import { ArgumentMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentMode.ts';
import { ArgumentValueMode } from '../../../../../../src/Valkyrja/Cli/Routing/Enum/ArgumentValueMode.ts';
import { CliRoutingArgumentValuesValidationException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingArgumentValuesValidationException.ts';
import { CliRoutingNoCastException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingNoCastException.ts';
import { Cast } from '../../../../../../src/Valkyrja/Type/Data/Cast.ts';

describe('ArgumentParameter', () => {
    it('defaults to an optional, single-value parameter with no cast or arguments', () => {
        const parameter = new ArgumentParameter('name', 'description');

        expect(parameter.getName()).toBe('name');
        expect(parameter.getDescription()).toBe('description');
        expect(parameter.hasCast()).toBe(false);
        expect(parameter.getMode()).toBe(ArgumentMode.OPTIONAL);
        expect(parameter.getValueMode()).toBe(ArgumentValueMode.DEFAULT);
        expect(parameter.getArguments()).toHaveLength(0);
    });

    it('manages the name, description, mode, and value mode immutably', () => {
        const parameter = new ArgumentParameter('name', 'description');

        expect(parameter.withName('other').getName()).toBe('other');
        expect(parameter.withDescription('new').getDescription()).toBe('new');
        expect(parameter.withMode(ArgumentMode.REQUIRED).getMode()).toBe(ArgumentMode.REQUIRED);
        expect(parameter.withValueMode(ArgumentValueMode.ARRAY).getValueMode()).toBe(ArgumentValueMode.ARRAY);
    });

    it('manages the cast immutably and throws when missing', () => {
        const parameter = new ArgumentParameter('name', 'description');
        const cast = new Cast('string');

        expect(() => parameter.getCast()).toThrow(CliRoutingNoCastException);

        const withCast = parameter.withCast(cast);
        expect(withCast.hasCast()).toBe(true);
        expect(withCast.getCast()).toBe(cast);
        expect(withCast.withoutCast().hasCast()).toBe(false);
    });

    it('manages arguments immutably and reports first values', () => {
        const parameter = new ArgumentParameter('name', 'description');

        expect(parameter.hasFirstValue()).toBe(false);
        expect(parameter.getFirstValue()).toBe('');

        const withArguments = parameter.withArguments(new Argument('a'));
        expect(withArguments.hasFirstValue()).toBe(true);
        expect(withArguments.getFirstValue()).toBe('a');
        expect(withArguments.getCastValues()).toStrictEqual(['a']);

        expect(withArguments.withAddedArguments(new Argument('b')).getArguments()).toHaveLength(2);
    });

    it('builds cast values for each argument when a cast is present', () => {
        const parameter = new ArgumentParameter('name', 'description', new Cast('string')).withArguments(
            new Argument('a'),
            new Argument('b'),
        );

        expect(parameter.getCastValues()).toStrictEqual(['a', 'b']);
    });

    it('validates required and single-value constraints', () => {
        const optional = new ArgumentParameter('name', 'description');
        expect(optional.areValuesValid()).toBe(true);

        const requiredEmpty = optional.withMode(ArgumentMode.REQUIRED);
        expect(requiredEmpty.areValuesValid()).toBe(false);

        const requiredFilled = requiredEmpty.withArguments(new Argument('a'));
        expect(requiredFilled.areValuesValid()).toBe(true);

        const tooManyForDefault = optional.withArguments(new Argument('a'), new Argument('b'));
        expect(tooManyForDefault.areValuesValid()).toBe(false);

        const arrayMode = tooManyForDefault.withValueMode(ArgumentValueMode.ARRAY);
        expect(arrayMode.areValuesValid()).toBe(true);
    });

    it('validateValues returns itself when valid and throws otherwise', () => {
        const valid = new ArgumentParameter('name', 'description');
        expect(valid.validateValues()).toBe(valid);

        const invalid = valid.withMode(ArgumentMode.REQUIRED);
        expect(() => invalid.validateValues()).toThrow(CliRoutingArgumentValuesValidationException);
    });
});
