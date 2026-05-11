import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import type { StreamContract } from '../Stream/Contract/StreamContract.js';
import type { ProtocolVersion } from '../Enum/ProtocolVersion.js';

export interface MessageContract {
    getProtocolVersion(): ProtocolVersion;
    withProtocolVersion(version: ProtocolVersion): this;
    getHeaders(): HeaderCollectionContract;
    withHeaders(headers: HeaderCollectionContract): this;
    getBody(): StreamContract;
    withBody(body: StreamContract): this;
}
