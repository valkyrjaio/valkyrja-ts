/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
