/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ErrorFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/ErrorFormatter.ts';
import { ErrorMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/ErrorMessage.ts';

describe('ErrorMessage', () => {
    it('wraps the text with an error formatter', () => {
        const message = new ErrorMessage('boom');

        expect(message.getText()).toBe('boom');
        expect(message.getFormatter()).toBeInstanceOf(ErrorFormatter);
    });
});
