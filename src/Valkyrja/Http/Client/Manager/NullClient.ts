/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { EmptyResponse } from '../../Message/Response/EmptyResponse.ts';

import type { RequestContract } from '../../Message/Request/Contract/RequestContract.ts';
import type { ResponseContract } from '../../Message/Response/Contract/ResponseContract.ts';
import type { ClientContract } from './Contract/ClientContract.ts';

export class NullClient implements ClientContract {
    sendRequest(_request: RequestContract): ResponseContract {
        return new EmptyResponse();
    }
}
