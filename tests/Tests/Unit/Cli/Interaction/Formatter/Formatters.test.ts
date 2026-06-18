/*
 * This file is part of the Valkyrja package.
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
import { HighlightedTextFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/HighlightedTextFormatter.ts';
import { QuestionFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/QuestionFormatter.ts';
import { SuccessFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/SuccessFormatter.ts';
import { WarningFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/WarningFormatter.ts';

describe('Cli Formatters', () => {
    it('ErrorFormatter uses light white text on a red background', () => {
        const formats = new ErrorFormatter().getFormats();

        expect(formats).toHaveLength(2);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.LIGHT_WHITE));
        expect(formats[1]?.getSetCode()).toBe(String(BackgroundColor.RED));
    });

    it('WarningFormatter uses black text on a yellow background', () => {
        const formats = new WarningFormatter().getFormats();

        expect(formats).toHaveLength(2);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.BLACK));
        expect(formats[1]?.getSetCode()).toBe(String(BackgroundColor.YELLOW));
    });

    it('SuccessFormatter uses light white text on a green background', () => {
        const formats = new SuccessFormatter().getFormats();

        expect(formats).toHaveLength(2);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.LIGHT_WHITE));
        expect(formats[1]?.getSetCode()).toBe(String(BackgroundColor.GREEN));
    });

    it('QuestionFormatter uses magenta text', () => {
        const formats = new QuestionFormatter().getFormats();

        expect(formats).toHaveLength(1);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.MAGENTA));
    });

    it('HighlightedTextFormatter uses yellow text', () => {
        const formats = new HighlightedTextFormatter().getFormats();

        expect(formats).toHaveLength(1);
        expect(formats[0]?.getSetCode()).toBe(String(TextColor.YELLOW));
    });
});
