/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { SameSite } from '../../../../../../src/Valkyrja/Http/Message/Enum/SameSite.ts';

describe('SameSite', () => {
    it('exposes the same-site policy values', () => {
        expect(SameSite.NONE).toBe('none');
        expect(SameSite.LAX).toBe('lax');
        expect(SameSite.STRICT).toBe('strict');
    });
});
