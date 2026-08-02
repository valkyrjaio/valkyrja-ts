/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HeaderCollectionContract } from '../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { StreamContract } from '../Stream/Contract/StreamContract.ts';
import type { ProtocolVersion } from '../Enum/ProtocolVersion.ts';

export interface MessageContract {
    getProtocolVersion(): ProtocolVersion;
    withProtocolVersion(version: ProtocolVersion): this;
    getHeaders(): HeaderCollectionContract;
    withHeaders(headers: HeaderCollectionContract): this;
    getBody(): StreamContract;
    withBody(body: StreamContract): this;
}
