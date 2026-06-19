/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { Messages } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Messages.ts';

describe('Messages', () => {
    it('concatenates the text and formatted text of its children', () => {
        const messages = new Messages(new Message('a'), new Message('b'));

        expect(messages.getText()).toBe('ab');
        expect(messages.getFormattedText()).toBe('ab');
    });
});
