/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RequestContract } from '../../../Message/Request/Contract/RequestContract.ts';
import type { ResponseContract } from '../../../Message/Response/Contract/ResponseContract.ts';

export interface ClientContract {
    sendRequest(request: RequestContract): ResponseContract;
}
