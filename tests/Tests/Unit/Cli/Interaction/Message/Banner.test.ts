/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
