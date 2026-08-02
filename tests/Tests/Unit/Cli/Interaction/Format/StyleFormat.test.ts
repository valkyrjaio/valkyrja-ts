/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Style, styleDefault } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/Style.ts';
import { StyleFormat } from '../../../../../../src/Valkyrja/Cli/Interaction/Format/StyleFormat.ts';

describe('StyleFormat', () => {
    it('uses the style as the set code and the style-specific default as the unset code', () => {
        const format = new StyleFormat(Style.BOLD);

        expect(format.getSetCode()).toBe(String(Style.BOLD));
        expect(format.getUnsetCode()).toBe(String(styleDefault(Style.BOLD)));
    });
});
