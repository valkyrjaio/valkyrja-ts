/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.js';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.js';
import type { TerminatedMiddlewareContract } from '../../Contract/TerminatedMiddlewareContract.js';
import type { HandlerContract } from './HandlerContract.js';

export interface TerminatedHandlerContract extends HandlerContract<TerminatedMiddlewareContract> {
    terminated(request: ServerRequestContract, response: ResponseContract): void;
}
