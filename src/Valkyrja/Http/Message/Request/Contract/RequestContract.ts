/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { MessageContract } from '../../Contract/MessageContract.ts';
import type { UriContract } from '../../Uri/Contract/UriContract.ts';
import type { RequestMethod } from '../../Enum/RequestMethod.ts';

export interface RequestContract extends MessageContract {
    getRequestTarget(): string;
    withRequestTarget(requestTarget: string): this;
    getMethod(): RequestMethod;
    withMethod(method: RequestMethod): this;
    getUri(): UriContract;
    withUri(uri: UriContract, preserveHost?: boolean): this;
}
