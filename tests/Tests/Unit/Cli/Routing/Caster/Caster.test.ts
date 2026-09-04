/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Argument } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Argument.ts';
import { Option } from '../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { Caster } from '../../../../../../src/Valkyrja/Cli/Routing/Caster/Caster.ts';
import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/ArgumentParameter.ts';
import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Data/OptionParameter.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { Cast } from '../../../../../../src/Valkyrja/Type/Data/Cast.ts';
import { TypeFixture } from '../../../../Fixtures/Type/TypeFixture.ts';

describe('Caster', () => {
    const containerWithType = (): Container => {
        const container = new Container();
        container.bind(TypeFixture.name, TypeFixture.make);

        return container;
    };

    it('returns each raw value when the parameter carries no cast', () => {
        const parameter = new ArgumentParameter('name', 'description').withArguments(new Argument('a'));

        expect(new Caster(containerWithType()).getCastValues(parameter)).toStrictEqual(['a']);
    });

    it('converts each value when the cast converts', () => {
        const parameter = new ArgumentParameter('name', 'description', new Cast(TypeFixture.name)).withArguments(
            new Argument('a'),
            new Argument('b'),
        );

        expect(new Caster(containerWithType()).getCastValues(parameter)).toStrictEqual(['cast:a', 'cast:b']);
    });

    it('returns the type itself when the cast does not convert', () => {
        const parameter = new ArgumentParameter('name', 'description', new Cast(TypeFixture.name, false)).withArguments(
            new Argument('a'),
        );

        const values = new Caster(containerWithType()).getCastValues(parameter);

        expect(values).toHaveLength(1);
        expect(values[0]).toBeInstanceOf(TypeFixture);
    });

    it('casts an option parameter the same way', () => {
        const parameter = new OptionParameter('name', 'description', '', new Cast(TypeFixture.name)).withOptions(
            new Option('name', 'a'),
        );

        expect(new Caster(containerWithType()).getCastValues(parameter)).toStrictEqual(['cast:a']);
    });

    it('builds one type per value for a singleton binding', () => {
        const container = new Container();
        container.bindSingleton(TypeFixture.name, TypeFixture.make);
        const parameter = new ArgumentParameter('name', 'description', new Cast(TypeFixture.name)).withArguments(
            new Argument('a'),
            new Argument('b'),
        );

        expect(new Caster(container).getCastValues(parameter)).toStrictEqual(['cast:a', 'cast:b']);
    });

    it('defaults to a new container', () => {
        expect(new Caster()).toBeInstanceOf(Caster);
    });
});
