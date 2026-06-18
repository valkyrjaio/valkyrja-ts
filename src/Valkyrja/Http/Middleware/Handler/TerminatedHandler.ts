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
import type { TerminatedMiddlewareContract } from '../Contract/TerminatedMiddlewareContract.ts';
import { Handler } from './Abstract/Handler.ts';
import type { TerminatedHandlerContract } from './Contract/TerminatedHandlerContract.ts';

export class TerminatedHandler extends Handler<TerminatedMiddlewareContract> implements TerminatedHandlerContract {
    terminated(request: ServerRequestContract, response: ResponseContract): void {
        const next = this.next;

        if (next !== null) {
            this.getMiddleware(next).terminated(request, response, this);
        }
    }
}
