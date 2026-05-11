import type { MessageContract } from '../Message/Contract/MessageContract.js';
import type { EmptyOutputContract } from './Contract/EmptyOutputContract.js';
import { Output } from './Output.js';

export class EmptyOutput extends Output implements EmptyOutputContract {
    protected override outputMessage(_message: MessageContract): void {
        // empty on purpose
    }
}
