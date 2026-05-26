/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ResponseContract } from './ResponseContract.js';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.js';
import type { StatusCode } from '../../Enum/StatusCode.js';

export interface JsonResponseContract extends ResponseContract {
    createFromData(
        data?: Record<string, unknown> | null,
        statusCode?: StatusCode | null,
        headers?: HeaderCollectionContract | null,
    ): this;
    getBodyAsJson(): Record<string, unknown>;
    withJsonAsBody(data: Record<string, unknown>): this;
    withCallback(callback: string): this;
    withoutCallback(): this;
}
