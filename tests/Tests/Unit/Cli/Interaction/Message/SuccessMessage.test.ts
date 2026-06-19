/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { SuccessFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/SuccessFormatter.ts';
import { SuccessMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/SuccessMessage.ts';

describe('SuccessMessage', () => {
    it('wraps the text with a success formatter', () => {
        const message = new SuccessMessage('done');

        expect(message.getText()).toBe('done');
        expect(message.getFormatter()).toBeInstanceOf(SuccessFormatter);
    });
});
