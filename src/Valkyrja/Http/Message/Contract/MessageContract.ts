/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

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
