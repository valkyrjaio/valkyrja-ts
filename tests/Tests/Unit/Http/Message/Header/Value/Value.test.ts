/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Component } from '../../../../../../../src/Valkyrja/Http/Message/Header/Value/Component/Component.ts';
import { Value } from '../../../../../../../src/Valkyrja/Http/Message/Header/Value/Value.ts';

describe('Value', () => {
    it('filters out empty components and renders them joined by "; "', () => {
        const value = new Value('text/html', '', 'charset=utf-8');

        expect(value.getComponents()).toStrictEqual(['text/html', 'charset=utf-8']);
        expect(value.toString()).toBe('text/html; charset=utf-8');
    });

    it('parses a value with semicolon-separated components', () => {
        const value = Value.fromValue('text/html; charset=utf-8');

        expect(value.getComponents()).toStrictEqual(['text/html', 'charset=utf-8']);
    });

    it('parses a single-component value', () => {
        expect(Value.fromValue('text/html').getComponents()).toStrictEqual(['text/html']);
    });

    it('manages components immutably', () => {
        const value = new Value('a');

        expect(value.withComponents('b').getComponents()).toStrictEqual(['b']);
        expect(value.withAddedComponents('b', 'c').getComponents()).toStrictEqual(['a', 'b', 'c']);
    });

    it('stringifies component objects', () => {
        const value = new Value(new Component('charset', 'utf-8'));

        expect(value.toString()).toBe('charset=utf-8');
    });
});
