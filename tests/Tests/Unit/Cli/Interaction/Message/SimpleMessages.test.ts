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
import { SuccessFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/SuccessFormatter.ts';
import { WarningFormatter } from '../../../../../../src/Valkyrja/Cli/Interaction/Formatter/WarningFormatter.ts';
import { ErrorMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/ErrorMessage.ts';
import { Messages } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Messages.ts';
import { Message } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Message.ts';
import { NewLine } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/NewLine.ts';
import { SuccessMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/SuccessMessage.ts';
import { WarningMessage } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/WarningMessage.ts';

describe('Simple messages', () => {
    it('NewLine carries a newline and no formatter by default', () => {
        const message = new NewLine();

        expect(message.getText()).toBe('\n');
        expect(message.hasFormatter()).toBe(false);
    });

    it('ErrorMessage uses an error formatter', () => {
        const message = new ErrorMessage('boom');

        expect(message.getText()).toBe('boom');
        expect(message.getFormatter()).toBeInstanceOf(ErrorFormatter);
    });

    it('SuccessMessage uses a success formatter', () => {
        const message = new SuccessMessage('done');

        expect(message.getText()).toBe('done');
        expect(message.getFormatter()).toBeInstanceOf(SuccessFormatter);
    });

    it('WarningMessage uses a warning formatter', () => {
        const message = new WarningMessage('careful');

        expect(message.getText()).toBe('careful');
        expect(message.getFormatter()).toBeInstanceOf(WarningFormatter);
    });

    it('Messages concatenates the text and formatted text of its children', () => {
        const messages = new Messages(new Message('a'), new Message('b'));

        expect(messages.getText()).toBe('ab');
        expect(messages.getFormattedText()).toBe('ab');
    });
});
