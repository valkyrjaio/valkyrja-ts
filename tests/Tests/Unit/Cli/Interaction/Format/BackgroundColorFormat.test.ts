/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
