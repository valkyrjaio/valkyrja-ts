import { WarningFormatter } from '../Formatter/WarningFormatter.js';
import { Message } from './Message.js';

export class WarningMessage extends Message {
    constructor(text: string) {
        super(text, new WarningFormatter());
    }
}