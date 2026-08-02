/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { BackgroundColor } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/BackgroundColor.ts';
import { TextColor } from '../../../../../../src/Valkyrja/Cli/Interaction/Enum/TextColor.ts';
import { ErrorFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/ErrorFormatter.ts';

describe('ErrorFormatter', () => {
    it('uses light white text on a red background', () => {
        const formats = new ErrorFormatter().getFormats();

        expect(formats).toHaveLength(2);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.LIGHT_WHITE));
        expect(formats[1]?.getSetCode()).toBe(String(BackgroundColor.RED));
    });
});
