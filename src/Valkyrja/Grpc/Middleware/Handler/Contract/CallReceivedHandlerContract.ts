/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { CallReceivedMiddlewareContract } from '../../Contract/CallReceivedMiddlewareContract.ts';
import type { CallReceivedResult } from '../../Data/CallReceivedResult.ts';
import type { HandlerContract } from './HandlerContract.ts';

export interface CallReceivedHandlerContract extends HandlerContract<CallReceivedMiddlewareContract> {
    callReceived(call: ServiceCallContract): Promise<CallReceivedResult>;
}
