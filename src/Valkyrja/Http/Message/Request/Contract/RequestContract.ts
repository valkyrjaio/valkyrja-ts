/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessageContract } from '../../Contract/MessageContract.ts';
import type { UriContract } from '../../Uri/Contract/UriContract.ts';
import type { RequestMethod } from '../../Enum/RequestMethod.ts';

export interface RequestContract extends MessageContract {
    getRequestTarget(): string;
    withRequestTarget(requestTarget: string): this;
    getMethod(): RequestMethod;
    withMethod(method: RequestMethod): this;
    getUri(): UriContract;
    withUri(uri: UriContract, preserveHost?: boolean): this;
}
