/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { HeaderContract } from '../Header/Contract/HeaderContract.ts';
import type { StreamContract } from '../Stream/Contract/StreamContract.ts';
import type { MessageContract } from '../Contract/MessageContract.ts';
import { ProtocolVersion } from '../Enum/ProtocolVersion.ts';
import { ObjectFactory } from '../../../Type/Object/Factory/ObjectFactory.ts';

export abstract class Message implements MessageContract {
    protected headers!: HeaderCollectionContract;
    protected protocolVersion: ProtocolVersion = ProtocolVersion.V1_1;
    protected stream!: StreamContract;

    getProtocolVersion(): ProtocolVersion {
        return this.protocolVersion;
    }

    withProtocolVersion(version: ProtocolVersion): this {
        const clone = ObjectFactory.clone(this);
        clone.protocolVersion = version;
        return clone;
    }

    getHeaders(): HeaderCollectionContract {
        return this.headers;
    }

    withHeaders(headers: HeaderCollectionContract): this {
        const clone = ObjectFactory.clone(this);
        clone.headers = headers;
        return clone;
    }

    getBody(): StreamContract {
        return this.stream;
    }

    withBody(body: StreamContract): this {
        const clone = ObjectFactory.clone(this);
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
        override: boolean = false,
    ): HeaderCollectionContract {
        const headerName = header.getNormalizedName();
        const newHeader =
            override || !headers.has(headerName)
                ? header
                : headers.get(headerName).withAddedValues(...header.getValues());
        return headers.withHeader(newHeader);
    }

    protected injectHeader(
        header: HeaderContract,
        headers: HeaderCollectionContract,
        override: boolean = false,
    ): HeaderCollectionContract {
        return Message.injectHeader(header, headers, override);
    }
}
