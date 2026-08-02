/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
