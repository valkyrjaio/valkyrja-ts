/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcRuntimeException } from './Abstract/GrpcRuntimeException.ts';

import type { CancellationReason } from '../../Message/Enum/CancellationReason.ts';

export class CancelledException extends GrpcRuntimeException {
    protected readonly reason: CancellationReason | null;

    constructor(message: string, reason: CancellationReason | null = null) {
        super(message);

        this.reason = reason;
    }

    /** Get the cause of the cancellation, or null if unspecified. */
    getReason(): CancellationReason | null {
        return this.reason;
    }
}
