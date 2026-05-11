import { Message } from './Message.js';
import { Messages } from './Messages.js';
import { NewLine } from './NewLine.js';

export class Banner extends Message {
    protected messages: Messages;

    constructor(protected message: Message) {
        super(message.getText());

        const text       = `    ${this.text}    `;
        const spaces     = ' '.repeat(text.length);

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