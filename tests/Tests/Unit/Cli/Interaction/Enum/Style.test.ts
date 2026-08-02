/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
