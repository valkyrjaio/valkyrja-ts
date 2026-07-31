/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import {
    StatusCode,
    statusCodeDefaultMessage,
    statusCodeFromValue,
    statusCodeIsCancellation,
    statusCodeIsOk,
} from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { GrpcInvalidStatusCodeException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/GrpcInvalidStatusCodeException.ts';

describe('StatusCode', () => {
    it('exposes the wire values 0 through 16', () => {
        expect(StatusCode.OK).toBe(0);
        expect(StatusCode.CANCELLED).toBe(1);
        expect(StatusCode.DEADLINE_EXCEEDED).toBe(4);
        expect(StatusCode.UNIMPLEMENTED).toBe(12);
        expect(StatusCode.UNAUTHENTICATED).toBe(16);
    });

    it('maps every code to a default message', () => {
        expect(statusCodeDefaultMessage(StatusCode.OK)).toBe('OK');
        expect(statusCodeDefaultMessage(StatusCode.CANCELLED)).toBe('The operation was cancelled');
        expect(statusCodeDefaultMessage(StatusCode.UNKNOWN)).toBe('Unknown error');
        expect(statusCodeDefaultMessage(StatusCode.INVALID_ARGUMENT)).toBe('Invalid argument');
        expect(statusCodeDefaultMessage(StatusCode.DEADLINE_EXCEEDED)).toBe('Deadline exceeded');
        expect(statusCodeDefaultMessage(StatusCode.NOT_FOUND)).toBe('Not found');
        expect(statusCodeDefaultMessage(StatusCode.ALREADY_EXISTS)).toBe('Already exists');
        expect(statusCodeDefaultMessage(StatusCode.PERMISSION_DENIED)).toBe('Permission denied');
        expect(statusCodeDefaultMessage(StatusCode.RESOURCE_EXHAUSTED)).toBe('Resource exhausted');
        expect(statusCodeDefaultMessage(StatusCode.FAILED_PRECONDITION)).toBe('Failed precondition');
        expect(statusCodeDefaultMessage(StatusCode.ABORTED)).toBe('Aborted');
        expect(statusCodeDefaultMessage(StatusCode.OUT_OF_RANGE)).toBe('Out of range');
        expect(statusCodeDefaultMessage(StatusCode.UNIMPLEMENTED)).toBe('Unimplemented');
        expect(statusCodeDefaultMessage(StatusCode.INTERNAL)).toBe('Internal error');
        expect(statusCodeDefaultMessage(StatusCode.UNAVAILABLE)).toBe('Unavailable');
        expect(statusCodeDefaultMessage(StatusCode.DATA_LOSS)).toBe('Data loss');
        expect(statusCodeDefaultMessage(StatusCode.UNAUTHENTICATED)).toBe('Unauthenticated');
    });

    it('classifies the success outcome', () => {
        expect(statusCodeIsOk(StatusCode.OK)).toBe(true);
        expect(statusCodeIsOk(StatusCode.INTERNAL)).toBe(false);
    });

    it('classifies cancellation outcomes', () => {
        expect(statusCodeIsCancellation(StatusCode.CANCELLED)).toBe(true);
        expect(statusCodeIsCancellation(StatusCode.DEADLINE_EXCEEDED)).toBe(true);
        expect(statusCodeIsCancellation(StatusCode.OK)).toBe(false);
        expect(statusCodeIsCancellation(StatusCode.INTERNAL)).toBe(false);
    });

    it('resolves a code from its wire value', () => {
        expect(statusCodeFromValue(0)).toBe(StatusCode.OK);
        expect(statusCodeFromValue(16)).toBe(StatusCode.UNAUTHENTICATED);
    });

    it('rejects a value that names no code', () => {
        expect(() => statusCodeFromValue(17)).toThrow(GrpcInvalidStatusCodeException);
        expect(() => statusCodeFromValue(17)).toThrow('No gRPC status code for value `17`');
    });
});
