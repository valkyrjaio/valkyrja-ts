/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Component } from '../../../../../../../../src/Valkyrja/Http/Message/Header/Value/Component/Component.ts';

describe('Component', () => {
    it('trims the token and text', () => {
        const component = new Component('  token  ', '  text  ');

        expect(component.getToken()).toBe('token');
        expect(component.getText()).toBe('text');
        expect(component.toString()).toBe('token=text');
    });

    it('renders just the token when there is no text', () => {
        expect(new Component('flag').toString()).toBe('flag');
    });

    it('parses a token=text component', () => {
        const component = Component.fromValue('key=value=extra');

        expect(component.getToken()).toBe('key');
        expect(component.getText()).toBe('value=extra');
    });

    it('parses a bare token component', () => {
        expect(Component.fromValue('flag').getToken()).toBe('flag');
    });

    it('updates the token and text immutably', () => {
        const component = new Component('a', 'b');

        expect(component.withToken('c').getToken()).toBe('c');
        expect(component.withText('d').getText()).toBe('d');
        expect(component.getToken()).toBe('a');
    });
});
