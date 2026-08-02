/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import {
    BackgroundColor,
    backgroundColorDefault,
} from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/BackgroundColor.ts';
import { BackgroundColorFormat } from '../../../../../../src/Valkyrja/Cli/Interaction/Format/BackgroundColorFormat.ts';

describe('BackgroundColorFormat', () => {
    it('uses the background color as the set code and the default as the unset code', () => {
        const format = new BackgroundColorFormat(BackgroundColor.BLUE);

        expect(format.getSetCode()).toBe(String(BackgroundColor.BLUE));
        expect(format.getUnsetCode()).toBe(String(backgroundColorDefault()));
    });
});
