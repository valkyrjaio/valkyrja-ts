/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { TextColor } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/TextColor.ts';
import { HighlightedTextFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/HighlightedTextFormatter.ts';

describe('HighlightedTextFormatter', () => {
    it('uses yellow text', () => {
        const formats = new HighlightedTextFormatter().getFormats();

        expect(formats).toHaveLength(1);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.YELLOW));
    });
});
