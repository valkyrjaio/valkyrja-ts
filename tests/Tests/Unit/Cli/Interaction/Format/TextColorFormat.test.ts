/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
