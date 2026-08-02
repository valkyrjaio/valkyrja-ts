/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { TextColor } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/TextColor.ts';
import { QuestionFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/QuestionFormatter.ts';

describe('QuestionFormatter', () => {
    it('uses magenta text', () => {
        const formats = new QuestionFormatter().getFormats();

        expect(formats).toHaveLength(1);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.MAGENTA));
    });
});
