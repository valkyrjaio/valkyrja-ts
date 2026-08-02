/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ModeTranslation } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Enum/ModeTranslation.ts';

describe('ModeTranslation', () => {
    it('exposes the mode translation values', () => {
        expect(ModeTranslation.NONE).toBe('');
        expect(ModeTranslation.WINDOWS).toBe('t');
        expect(ModeTranslation.BINARY_SAFE).toBe('b');
    });
});
