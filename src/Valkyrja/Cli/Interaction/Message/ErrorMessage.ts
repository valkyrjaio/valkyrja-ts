import { ErrorFormatter } from '../Formatter/ErrorFormatter.js';
import { Message } from './Message.js';

export class ErrorMessage extends Message {
    constructor(text: string) {
        super(text, new ErrorFormatter());
    }
}
