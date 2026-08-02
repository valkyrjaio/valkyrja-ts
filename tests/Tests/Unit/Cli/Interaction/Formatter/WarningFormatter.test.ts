/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { BackgroundColor } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/BackgroundColor.ts';
import { TextColor } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/TextColor.ts';
import { WarningFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/WarningFormatter.ts';

describe('WarningFormatter', () => {
    it('uses black text on a yellow background', () => {
        const formats = new WarningFormatter().getFormats();

        expect(formats).toHaveLength(2);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.BLACK));
        expect(formats[1]?.getSetCode()).toBe(String(BackgroundColor.YELLOW));
    });
});
