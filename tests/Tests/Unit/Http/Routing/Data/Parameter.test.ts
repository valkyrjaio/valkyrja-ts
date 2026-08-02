/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Parameter } from '../../../../../../src/Valkyrja/Http/Routing/Data/Parameter.ts';
import { HttpRoutingNoCastException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingNoCastException.ts';
import { Cast } from '../../../../../../src/Valkyrja/Type/Data/Cast.ts';

describe('Parameter', () => {
    it('exposes its defaults', () => {
        const parameter = new Parameter('id', '\\d+');

        expect(parameter.getName()).toBe('id');
        expect(parameter.getRegex()).toBe('\\d+');
        expect(parameter.hasCast()).toBe(false);
        expect(parameter.isOptional()).toBe(false);
        expect(parameter.shouldCapture()).toBe(true);
        expect(parameter.getDefault()).toBeNull();
        expect(parameter.getValue()).toBeNull();
    });

    it('manages the name, regex, optional, and capture flags immutably', () => {
        const parameter = new Parameter('id', '\\d+');

        expect(parameter.withName('slug').getName()).toBe('slug');
        expect(parameter.withRegex('[a-z]+').getRegex()).toBe('[a-z]+');
        expect(parameter.withIsOptional(true).isOptional()).toBe(true);
        expect(parameter.withShouldCapture(false).shouldCapture()).toBe(false);
    });

    it('manages the cast, throwing when absent', () => {
        const parameter = new Parameter('id', '\\d+');
        const cast = new Cast('int');

        expect(() => parameter.getCast()).toThrow(HttpRoutingNoCastException);
        expect(parameter.withCast(cast).getCast()).toBe(cast);
    });

    it('manages the default and current values immutably', () => {
        const parameter = new Parameter('id', '\\d+');

        expect(parameter.withDefault(5).getDefault()).toBe(5);
        expect(parameter.withValue('abc').getValue()).toBe('abc');
    });
});
