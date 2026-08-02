/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HeaderValue } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderValue.ts';

describe('HeaderValue', () => {
    it('exposes the bearer authorization scheme', () => {
        expect(HeaderValue.BEARER).toBe('Bearer');
    });
});
