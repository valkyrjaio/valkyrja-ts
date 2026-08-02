/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { StructContract } from '../../Contract/StructContract.ts';

export interface RequestStructContract extends StructContract {
    getDataFromRequest(request: ServerRequestContract): Record<string, unknown>;
    determineIfRequestContainsExtraData(request: ServerRequestContract): boolean;
}
