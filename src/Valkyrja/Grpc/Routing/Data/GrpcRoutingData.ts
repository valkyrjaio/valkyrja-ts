/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { RouteContract } from './Contract/RouteContract.ts';

/**
 * The cached service map generated ahead of time (by Sindri), keyed by fully-qualified method name.
 * Parallels HTTP's `HttpRoutingData` and CLI's `CliRoutingData`. The generated
 * `AppGrpcRoutingData` supplies the real map; this empty default is used when no cache exists.
 */
export class GrpcRoutingData {
    constructor(public readonly routes: Record<string, () => RouteContract> = {}) {}
}
