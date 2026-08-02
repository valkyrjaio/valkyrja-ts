/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { StructContract } from '../../Contract/StructContract.ts';

export interface ResponseStructContract extends StructContract {
    getStructuredData(data: Record<string, unknown>, includeAll?: boolean): Record<string | number, unknown>;
}
