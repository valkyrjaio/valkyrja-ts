import { SuccessFormatter } from '../Formatter/SuccessFormatter.js';
import { Message } from './Message.js';

export class SuccessMessage extends Message {
    constructor(text: string) {
        super(text, new SuccessFormatter());
    }
}
