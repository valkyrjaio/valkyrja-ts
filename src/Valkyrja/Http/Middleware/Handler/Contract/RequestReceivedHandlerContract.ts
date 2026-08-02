/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { RequestReceivedMiddlewareContract } from '../../Contract/RequestReceivedMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface RequestReceivedHandlerContract extends HandlerContract<RequestReceivedMiddlewareContract> {
    requestReceived(request: ServerRequestContract): ResponseContract | ServerRequestContract;
}
