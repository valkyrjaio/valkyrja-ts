/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Message } from './Message.ts';
import { Messages } from './Messages.ts';
import { NewLine } from './NewLine.ts';

export class Banner extends Message {
    protected messages: Messages;

    constructor(protected message: Message) {
        super(message.getText());

        const text = `    ${this.text}    `;
        const spaces = ' '.repeat(text.length);

        this.messages = new Messages(
            new NewLine(),
            this.message.withText(spaces),
            new NewLine(),
            this.message.withText(text),
            new NewLine(),
            this.message.withText(spaces),
            new NewLine(),
        );
    }

    override getText(): string {
        return this.messages.getText();
    }

    override getFormattedText(): string {
        return this.messages.getFormattedText();
    }
}
