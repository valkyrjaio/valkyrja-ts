import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { PlainOutputContract } from './Contract/PlainOutputContract.js';
import { Output } from './Output.js';

export class PlainOutput extends Output implements PlainOutputContract {
    protected override outputMessage(message: MessageContract): void {
        process.stdout.write(message.getText().replace(/<[^>]*>/g, ''));
    }
}
