/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { MessageContract } from '../../Contract/MessageContract.js';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import type { CookieContract } from '../../Header/Value/Contract/CookieContract.js';
import type { StatusCode } from '../../Enum/StatusCode.js';

export interface ResponseContract extends MessageContract {
    create(content?: string | null, statusCode?: StatusCode | null, headers?: HeaderCollectionContract | null): this;
    getStatusCode(): StatusCode;
    withStatusCode(code: StatusCode): this;
    getReasonPhrase(): string;
    withReasonPhrase(reasonPhrase: string): this;
    withCookie(cookie: CookieContract): this;
    withoutCookie(cookie: CookieContract): this;
}
