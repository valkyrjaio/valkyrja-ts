/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { ResponseSentMiddlewareContract } from '../../Contract/ResponseSentMiddlewareContract.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface ResponseSentHandlerContract extends HandlerContract<ResponseSentMiddlewareContract> {
    responseSent(call: ServiceCallContract, response: ServiceResponseContract): Promise<void>;
}
