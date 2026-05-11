import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.js';
import type { HeaderContract } from '../Header/Contract/HeaderContract.js';
import type { StreamContract } from '../Stream/Contract/StreamContract.js';
import type { MessageContract } from '../Contract/MessageContract.js';
import { ProtocolVersion } from '../Enum/ProtocolVersion.js';

export abstract class Message implements MessageContract {
    protected headers!: HeaderCollectionContract;
    protected protocolVersion: ProtocolVersion = ProtocolVersion.V1_1;
    protected stream!: StreamContract;

    getProtocolVersion(): ProtocolVersion {
        return this.protocolVersion;
    }

    withProtocolVersion(version: ProtocolVersion): this {
        const clone               = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.protocolVersion     = version;
        return clone;
    }

    getHeaders(): HeaderCollectionContract {
        return this.headers;
    }

    withHeaders(headers: HeaderCollectionContract): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.headers = headers;
        return clone;
    }

    getBody(): StreamContract {
        return this.stream;
    }

    withBody(body: StreamContract): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.stream = body;
        clone.stream.rewind();
        return clone;
    }

    protected setBody(body: StreamContract): void {
        this.stream = body;
    }

    static injectHeader(
        header: HeaderContract,
        headers: HeaderCollectionContract,
        override: boolean = false
    ): HeaderCollectionContract {
        const headerName = header.getNormalizedName();
        const newHeader  = override || !headers.has(headerName)
            ? header
            : headers.get(headerName).withAddedValues(...header.getValues());
        return headers.withHeader(newHeader);
    }

    protected injectHeader(
        header: HeaderContract,
        headers: HeaderCollectionContract,
        override: boolean = false
    ): HeaderCollectionContract {
        return Message.injectHeader(header, headers, override);
    }
}
