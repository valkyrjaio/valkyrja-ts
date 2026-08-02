/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Argument } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Argument.ts';
import { ArgumentContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Argument/Contract/ArgumentContract.ts';

describe('Argument', () => {
    it('exposes its value', () => {
        expect(new Argument('value').getValue()).toBe('value');
    });

    it('withValue returns an immutable clone with the new value', () => {
        const argument = new Argument('value');
        const next = argument.withValue('other');

        expect(next).not.toBe(argument);
        expect(argument.getValue()).toBe('value');
        expect(next.getValue()).toBe('other');
    });

    it('instanceOf is true for an Argument and false otherwise', () => {
        expect(ArgumentContract.instanceOf(new Argument('value'))).toBe(true);
        expect(ArgumentContract.instanceOf(null)).toBe(false);
        expect(ArgumentContract.instanceOf({})).toBe(false);
    });
});
