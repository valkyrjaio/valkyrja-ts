/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Style, styleDefault } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/Style.ts';

describe('Style', () => {
    it('maps each style to its reset code', () => {
        expect(styleDefault(Style.BOLD)).toBe(22);
        expect(styleDefault(Style.UNDERSCORE)).toBe(24);
        expect(styleDefault(Style.BLINK)).toBe(25);
        expect(styleDefault(Style.INVERSE)).toBe(27);
        expect(styleDefault(Style.CONCEAL)).toBe(28);
    });
});
