import type { FormatterContract } from '../Formatter/Contract/FormatterContract.js';
import { Message } from './Message.js';

export class NewLine extends Message {
    constructor(formatter: FormatterContract | null = null) {
        super('\n', formatter);
    }
}