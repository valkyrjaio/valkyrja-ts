/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ResponseContract } from './ResponseContract.ts';
import type { HeaderCollectionContract } from '../../Header/Collection/Contract/HeaderCollectionContract.ts';
import type { StatusCode } from '../../Enum/StatusCode.ts';

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
