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
import { SuccessFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/SuccessFormatter.ts';

describe('SuccessFormatter', () => {
    it('uses light white text on a green background', () => {
        const formats = new SuccessFormatter().getFormats();

        expect(formats).toHaveLength(2);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.LIGHT_WHITE));
        expect(formats[1]?.getSetCode()).toBe(String(BackgroundColor.GREEN));
    });
});
