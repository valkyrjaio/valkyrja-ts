/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { WarningFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/WarningFormatter.ts';
import { WarningMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/WarningMessage.ts';

describe('WarningMessage', () => {
    it('wraps the text with a warning formatter', () => {
        const message = new WarningMessage('careful');

        expect(message.getText()).toBe('careful');
        expect(message.getFormatter()).toBeInstanceOf(WarningFormatter);
    });
});
