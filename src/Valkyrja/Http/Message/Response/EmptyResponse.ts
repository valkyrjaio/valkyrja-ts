import type { EmptyResponseContract } from './Contract/EmptyResponseContract.js';
import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import { Response } from './Response.js';
import { HeaderCollection } from '../Header/Collection/HeaderCollection.js';
import { Stream } from '../Stream/Stream.js';
import { Mode } from '../Stream/Enum/Mode.js';
import { StatusCode } from '../Enum/StatusCode.js';

export class EmptyResponse extends Response implements EmptyResponseContract {
    constructor(headers: HeaderCollectionContract = new HeaderCollection()) {
        super(new Stream('', Mode.READ), StatusCode.NO_CONTENT, headers);
    }
}