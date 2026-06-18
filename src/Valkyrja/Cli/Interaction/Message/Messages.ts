/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessageContract } from './Contract/MessageContract.ts';
import { Message } from './Message.ts';

export class Messages extends Message {
    protected messages: MessageContract[];

    constructor(...messages: MessageContract[]) {
        super('');
        this.messages = messages;
    }

    override getText(): string {
        return this.messages.map((m) => m.getText()).join('');
    }

    override getFormattedText(): string {
        return this.messages.map((m) => m.getFormattedText()).join('');
    }
}
