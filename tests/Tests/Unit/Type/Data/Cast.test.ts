/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Cast } from '../../../../../src/Valkyrja/Type/Data/Cast.ts';

describe('Cast', () => {
    it('uses the given type with default convert and isArray', () => {
        const value = 'string';
        const data = new Cast(value);

        expect(data.type).toBe(value);
        expect(data.convert).toBe(true);
        expect(data.isArray).toBe(false);
    });

    it('allows convert to be disabled', () => {
        const value = 'string';
        const data = new Cast(value, false);

        expect(data.type).toBe(value);
        expect(data.convert).toBe(false);
        expect(data.isArray).toBe(false);
    });

    it('allows isArray to be enabled', () => {
        const value = 'string';
        const data = new Cast(value, true, true);

        expect(data.type).toBe(value);
        expect(data.convert).toBe(true);
        expect(data.isArray).toBe(true);
    });
});
