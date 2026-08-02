/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Banner } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Banner.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';

describe('Banner', () => {
    it('surrounds the message text with padded lines', () => {
        const banner = new Banner(new Message('hi'));

        const padded = `    hi    `;
        const spaces = ' '.repeat(padded.length);
        const expected = `\n${spaces}\n${padded}\n${spaces}\n`;

        expect(banner.getText()).toBe(expected);
        expect(banner.getFormattedText()).toBe(expected);
    });
});
