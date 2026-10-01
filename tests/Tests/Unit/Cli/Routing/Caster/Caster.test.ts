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
import { ContainerInvalidReferenceException } from '../../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidReferenceException.ts';
import { Cast } from '../../../../../../src/Valkyrja/Type/Data/Cast.ts';
import { TypeFixture } from '../../../../Fixtures/Type/TypeFixture.ts';

const TYPE_ID = 'Tests.Fixtures.Type.TypeFixture';

describe('Caster', () => {
    const containerWithType = (): Container => {
        const container = new Container();
        container.bind(TYPE_ID, TypeFixture.make);

        return container;
    };

    it('returns each raw value when the parameter carries no cast', () => {
        const parameter = new ArgumentParameter('name', 'description').withArguments(new Argument('a'));

        expect(new Caster(containerWithType()).getCastValues(parameter)).toStrictEqual(['a']);
    });

    it('converts each value when the cast converts', () => {
        const parameter = new ArgumentParameter('name', 'description', new Cast(TYPE_ID)).withArguments(
            new Argument('a'),
            new Argument('b'),
        );

        expect(new Caster(containerWithType()).getCastValues(parameter)).toStrictEqual(['cast:a', 'cast:b']);
    });

    it('returns the type itself when the cast does not convert', () => {
        const parameter = new ArgumentParameter('name', 'description', new Cast(TYPE_ID, false)).withArguments(
            new Argument('a'),
        );

        const values = new Caster(containerWithType()).getCastValues(parameter);

        expect(values).toHaveLength(1);
        expect(values[0]).toBeInstanceOf(TypeFixture);
        expect((values[0] as TypeFixture).asValue()).toBe('cast:a');
    });

    it('casts an option parameter the same way', () => {
        const parameter = new OptionParameter('name', 'description', '', new Cast(TYPE_ID)).withOptions(
            new Option('name', 'a'),
        );

        expect(new Caster(containerWithType()).getCastValues(parameter)).toStrictEqual(['cast:a']);
    });

    it('builds one type per value for a singleton binding', () => {
        const container = new Container();
        container.bindSingleton(TYPE_ID, TypeFixture.make);
        const parameter = new ArgumentParameter('name', 'description', new Cast(TYPE_ID)).withArguments(
            new Argument('a'),
            new Argument('b'),
        );

        expect(new Caster(container).getCastValues(parameter)).toStrictEqual(['cast:a', 'cast:b']);
    });

    it('throws when the cast type has no binding', () => {
        const parameter = new ArgumentParameter('name', 'description', new Cast(TYPE_ID)).withArguments(
            new Argument('a'),
        );

        expect(() => new Caster(new Container()).getCastValues(parameter)).toThrow(ContainerInvalidReferenceException);
    });

    it('throws when the cast type is an instance that setSingleton holds', () => {
        const container = new Container();
        container.setSingleton(TYPE_ID, new TypeFixture('held'));
        const parameter = new ArgumentParameter('name', 'description', new Cast(TYPE_ID)).withArguments(
            new Argument('a'),
        );

        expect(() => new Caster(container).getCastValues(parameter)).toThrow(ContainerInvalidReferenceException);
    });

    it('builds a type that carries every member of the contract', () => {
        const type = TypeFixture.make(new Container(), ['a']);

        expect(type.asValue()).toBe('cast:a');
        expect(type.asFlatValue()).toBe('cast:a');
        expect(type.modify((value) => `${String(value)}-modified`).asValue()).toBe('cast:a-modified');
    });
});
