/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ThrowableCaughtHandlerContract } from '../Handler/Contract/ThrowableCaughtHandlerContract.ts';

export interface ThrowableCaughtMiddlewareContract {
    throwableCaught(
        request: ServerRequestContract,
        response: ResponseContract,
        throwable: Error,
        handler: ThrowableCaughtHandlerContract,
    ): ResponseContract;
}
