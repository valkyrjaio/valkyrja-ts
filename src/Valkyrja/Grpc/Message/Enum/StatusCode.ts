/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcInvalidStatusCodeException } from '../../Throwable/Exception/GrpcInvalidStatusCodeException.ts';

export enum StatusCode {
    OK = 0,
    CANCELLED = 1,
    UNKNOWN = 2,
    INVALID_ARGUMENT = 3,
    DEADLINE_EXCEEDED = 4,
    NOT_FOUND = 5,
    ALREADY_EXISTS = 6,
    PERMISSION_DENIED = 7,
    RESOURCE_EXHAUSTED = 8,
    FAILED_PRECONDITION = 9,
    ABORTED = 10,
    OUT_OF_RANGE = 11,
    UNIMPLEMENTED = 12,
    INTERNAL = 13,
    UNAVAILABLE = 14,
    DATA_LOSS = 15,
    UNAUTHENTICATED = 16,
}

const statusCodeToDefaultMessage: Record<StatusCode, string> = {
    [StatusCode.OK]: 'OK',
    [StatusCode.CANCELLED]: 'The operation was cancelled',
    [StatusCode.UNKNOWN]: 'Unknown error',
    [StatusCode.INVALID_ARGUMENT]: 'Invalid argument',
    [StatusCode.DEADLINE_EXCEEDED]: 'Deadline exceeded',
    [StatusCode.NOT_FOUND]: 'Not found',
    [StatusCode.ALREADY_EXISTS]: 'Already exists',
    [StatusCode.PERMISSION_DENIED]: 'Permission denied',
    [StatusCode.RESOURCE_EXHAUSTED]: 'Resource exhausted',
    [StatusCode.FAILED_PRECONDITION]: 'Failed precondition',
    [StatusCode.ABORTED]: 'Aborted',
    [StatusCode.OUT_OF_RANGE]: 'Out of range',
    [StatusCode.UNIMPLEMENTED]: 'Unimplemented',
    [StatusCode.INTERNAL]: 'Internal error',
    [StatusCode.UNAVAILABLE]: 'Unavailable',
    [StatusCode.DATA_LOSS]: 'Data loss',
    [StatusCode.UNAUTHENTICATED]: 'Unauthenticated',
};

/** Get the default human-readable message for a code. */
export function statusCodeDefaultMessage(code: StatusCode): string {
    return statusCodeToDefaultMessage[code];
}

/** Whether the code represents a successful call outcome. */
export function statusCodeIsOk(code: StatusCode): boolean {
    return code === StatusCode.OK;
}

/** Whether the code represents a cancellation outcome. */
export function statusCodeIsCancellation(code: StatusCode): boolean {
    return code === StatusCode.CANCELLED || code === StatusCode.DEADLINE_EXCEEDED;
}

/**
 * Resolve a status code from its integer wire value.
 *
 * @throws GrpcInvalidStatusCodeException if no code matches the value
 */
export function statusCodeFromValue(value: number): StatusCode {
    if (!Object.hasOwn(statusCodeToDefaultMessage, value)) {
        throw new GrpcInvalidStatusCodeException(`No gRPC status code for value \`${String(value)}\``);
    }

    return value;
}
