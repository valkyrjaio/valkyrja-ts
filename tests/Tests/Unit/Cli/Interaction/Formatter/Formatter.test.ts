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
import { FormatterContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/Contract/FormatterContract.ts';
import { Formatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/Formatter.ts';

describe('Formatter', () => {
    it('returns the text unchanged when there are no formats', () => {
        const formatter = new Formatter();

        expect(formatter.getFormats()).toHaveLength(0);
        expect(formatter.formatText('hello')).toBe('hello');
    });

    it('wraps the text with the set and unset codes of its formats', () => {
        const formatter = new Formatter(new TextColorFormat(TextColor.RED));

        const set = String(TextColor.RED);
        const unset = String(textColorDefault());

        expect(formatter.formatText('hello')).toBe(`\x1b[${set}mhello\x1b[${unset}m`);
    });

    it('withFormats returns an immutable clone with the new formats', () => {
        const formatter = new Formatter();
        const next = formatter.withFormats(new TextColorFormat(TextColor.GREEN));

        expect(next).not.toBe(formatter);
        expect(formatter.getFormats()).toHaveLength(0);
        expect(next.getFormats()).toHaveLength(1);
    });

    it('instanceOf is true for a Formatter and false otherwise', () => {
        expect(FormatterContract.instanceOf(new Formatter())).toBe(true);
        expect(FormatterContract.instanceOf(null)).toBe(false);
        expect(FormatterContract.instanceOf({})).toBe(false);
    });
});
