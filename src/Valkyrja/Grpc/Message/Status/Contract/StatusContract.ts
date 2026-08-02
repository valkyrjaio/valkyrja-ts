/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { StatusCode } from '../../Enum/StatusCode.ts';

/**
 * The immutable outcome of a gRPC call: a code, a human-readable message, and optional rich error
 * details.
 *
 * Mirrors the pattern HTTP uses for status code plus reason phrase, with an additional field for
 * `google.rpc.Status` protobuf bytes carried in the `grpc-status-details-bin` trailer.
 */
export interface StatusContract {
    /** Get the gRPC status code. */
    getCode(): StatusCode;

    /** Get the human-readable message. Never null; defaults from the code. */
    getMessage(): string;

    /** Get the optional rich error details (`google.rpc.Status` protobuf bytes). */
    getDetails(): Uint8Array | null;

    /** Whether details are present. */
    hasDetails(): boolean;

    /** Whether the call succeeded. */
    isOk(): boolean;

    /** Whether the call was cancelled or its deadline elapsed. */
    isCancellation(): boolean;

    /** Return a copy with the given code. */
    withCode(code: StatusCode): StatusContract;

    /** Return a copy with the given message. */
    withMessage(message: string): StatusContract;

    /** Return a copy with the given rich error details. */
    withDetails(details: Uint8Array | null): StatusContract;
}
