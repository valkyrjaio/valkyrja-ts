/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
