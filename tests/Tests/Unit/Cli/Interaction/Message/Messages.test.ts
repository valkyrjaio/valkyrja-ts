/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
