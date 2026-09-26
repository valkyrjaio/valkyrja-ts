/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { StatusCode, statusCodeDefaultMessage, statusCodeIsCancellation, statusCodeIsOk } from '../Enum/StatusCode.ts';

import type { StatusContract } from './Contract/StatusContract.ts';

export class Status implements StatusContract {
    protected readonly code: StatusCode;
    protected readonly message: string;
    protected readonly details: Uint8Array | null;

    constructor(code: StatusCode, message: string = statusCodeDefaultMessage(code), details: Uint8Array | null = null) {
        this.code = code;
        this.message = message;
        this.details = details === null ? null : details.slice();
    }

    getCode(): StatusCode {
        return this.code;
    }

    getMessage(): string {
        return this.message;
    }

    getDetails(): Uint8Array | null {
        return this.details === null ? null : this.details.slice();
    }

    hasDetails(): boolean {
        return this.details !== null;
    }

    isOk(): boolean {
        return statusCodeIsOk(this.code);
    }

    isCancellation(): boolean {
        return statusCodeIsCancellation(this.code);
    }

    withCode(code: StatusCode): StatusContract {
        return new Status(code, this.message, this.details);
    }

    withMessage(message: string): StatusContract {
        return new Status(this.code, message, this.details);
    }

    withDetails(details: Uint8Array | null): StatusContract {
        return new Status(this.code, this.message, details);
    }

    // --- Factories -------------------------------------------------------------------------------

    static of(code: StatusCode, message: string | null = null): Status {
        return message === null ? new Status(code) : new Status(code, message);
    }

    static ok(): Status {
        return new Status(StatusCode.OK);
    }

    static cancelled(message: string | null = null): Status {
        return Status.of(StatusCode.CANCELLED, message);
    }

    static unknown(message: string | null = null): Status {
        return Status.of(StatusCode.UNKNOWN, message);
    }

    static invalidArgument(message: string | null = null): Status {
        return Status.of(StatusCode.INVALID_ARGUMENT, message);
    }

    static deadlineExceeded(message: string | null = null): Status {
        return Status.of(StatusCode.DEADLINE_EXCEEDED, message);
    }

    static notFound(message: string | null = null): Status {
        return Status.of(StatusCode.NOT_FOUND, message);
    }

    static alreadyExists(message: string | null = null): Status {
        return Status.of(StatusCode.ALREADY_EXISTS, message);
    }

    static permissionDenied(message: string | null = null): Status {
        return Status.of(StatusCode.PERMISSION_DENIED, message);
    }

    static resourceExhausted(message: string | null = null): Status {
        return Status.of(StatusCode.RESOURCE_EXHAUSTED, message);
    }

    static failedPrecondition(message: string | null = null): Status {
        return Status.of(StatusCode.FAILED_PRECONDITION, message);
    }

    static aborted(message: string | null = null): Status {
        return Status.of(StatusCode.ABORTED, message);
    }

    static outOfRange(message: string | null = null): Status {
        return Status.of(StatusCode.OUT_OF_RANGE, message);
    }

    static unimplemented(message: string | null = null): Status {
        return Status.of(StatusCode.UNIMPLEMENTED, message);
    }

    static internal(message: string | null = null, details: Uint8Array | null = null): Status {
        const resolved = message === null ? statusCodeDefaultMessage(StatusCode.INTERNAL) : message;

        return new Status(StatusCode.INTERNAL, resolved, details);
    }

    static unavailable(message: string | null = null): Status {
        return Status.of(StatusCode.UNAVAILABLE, message);
    }

    static dataLoss(message: string | null = null): Status {
        return Status.of(StatusCode.DATA_LOSS, message);
    }

    static unauthenticated(message: string | null = null): Status {
        return Status.of(StatusCode.UNAUTHENTICATED, message);
    }
}
