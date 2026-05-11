import type { MessageContract } from './Contract/MessageContract.js';
import { Message } from './Message.js';

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
