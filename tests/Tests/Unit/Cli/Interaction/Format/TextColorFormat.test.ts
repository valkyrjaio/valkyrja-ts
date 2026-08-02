/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { TextColor, textColorDefault } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/TextColor.ts';
import { TextColorFormat } from '../../../../../../src/Valkyrja/Cli/Interaction/Format/TextColorFormat.ts';

describe('TextColorFormat', () => {
    it('uses the text color as the set code and the default as the unset code', () => {
        const format = new TextColorFormat(TextColor.RED);

        expect(format.getSetCode()).toBe(String(TextColor.RED));
        expect(format.getUnsetCode()).toBe(String(textColorDefault()));
    });
});
