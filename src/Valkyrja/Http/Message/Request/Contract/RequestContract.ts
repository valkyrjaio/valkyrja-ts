import type { MessageContract } from '../../Contract/MessageContract.js';
import type { UriContract } from '../../Uri/Contract/UriContract.js';
import type { RequestMethod } from '../../Enum/RequestMethod.js';

export interface RequestContract extends MessageContract {
    getRequestTarget(): string;
    withRequestTarget(requestTarget: string): this;
    getMethod(): RequestMethod;
    withMethod(method: RequestMethod): this;
    getUri(): UriContract;
    withUri(uri: UriContract, preserveHost?: boolean): this;
}