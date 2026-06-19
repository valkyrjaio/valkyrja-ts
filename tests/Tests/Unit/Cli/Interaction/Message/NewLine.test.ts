/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { NewLine } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/NewLine.ts';

describe('NewLine', () => {
    it('carries a newline and no formatter by default', () => {
        const message = new NewLine();

        expect(message.getText()).toBe('\n');
        expect(message.hasFormatter()).toBe(false);
    });
});
