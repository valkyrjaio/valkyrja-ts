/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import { HttpResponseException } from './HttpResponseException.js';
import { StatusCode } from '../../Enum/StatusCode.js';

export class HttpNotFoundResponseException extends HttpResponseException {
    constructor(
        statusCode: StatusCode | null = null,
        message: string | null = null,
        headers: HeaderCollectionContract | null = null,
    ) {
        super(statusCode ?? StatusCode.NOT_FOUND, message, headers);
    }
}
