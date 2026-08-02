/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
