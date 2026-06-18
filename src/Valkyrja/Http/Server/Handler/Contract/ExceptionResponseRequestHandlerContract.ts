/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';
import type { RequestHandlerContract } from './RequestHandlerContract.ts';

export interface ExceptionResponseRequestHandlerContract extends RequestHandlerContract {
    createResponseFromException(exception: Error): ResponseContract;
}
