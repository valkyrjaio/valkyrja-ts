/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
