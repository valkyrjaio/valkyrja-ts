/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../Message/Request/Contract/ServerRequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ThrowableCaughtMiddlewareContract } from '../Contract/ThrowableCaughtMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { ThrowableCaughtHandlerContract } from './Contract/ThrowableCaughtHandlerContract.ts';

export class ThrowableCaughtHandler
    extends Handler<ThrowableCaughtMiddlewareContract>
    implements ThrowableCaughtHandlerContract
{
    throwableCaught(request: ServerRequestContract, response: ResponseContract, throwable: Error): ResponseContract {
        const next = this.next;

        return next !== null ? this.getMiddleware(next).throwableCaught(request, response, throwable, this) : response;
    }
}
