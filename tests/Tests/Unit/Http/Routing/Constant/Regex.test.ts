/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Regex } from '../../../../../../src/Valkyrja/Http/Routing/Constant/Regex.ts';

describe('Regex', () => {
    it('exposes the common path-segment patterns', () => {
        expect(Regex.NUM).toBe('\\d+');
        expect(Regex.ID).toBe(Regex.NUM);
        expect(Regex.SLUG).toBe('[a-zA-Z0-9-]+');
        expect(Regex.ALPHA).toBe('[a-zA-Z]+');
    });

    it('builds composed uuid and ulid patterns', () => {
        expect(Regex.UUID).toContain('-');
        expect(new RegExp(`^${Regex.UUID}$`).test('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
        expect(Regex.ULID).toContain('[0-7]');
    });

    it('exposes the grouping tokens', () => {
        expect(Regex.START_CAPTURE_GROUP).toBe('(');
        expect(Regex.END_CAPTURE_GROUP).toBe(')');
        expect(Regex.START_OPTIONAL_CAPTURE_GROUP).toContain(Regex.PATH);
    });
});
