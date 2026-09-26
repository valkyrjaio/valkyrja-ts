/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { Status } from '../../../../../../src/Valkyrja/Grpc/Message/Status/Status.ts';

describe('Status', () => {
    it('defaults the message from the code', () => {
        const status = new Status(StatusCode.NOT_FOUND);

        expect(status.getCode()).toBe(StatusCode.NOT_FOUND);
        expect(status.getMessage()).toBe('Not found');
        expect(status.getDetails()).toBeNull();
        expect(status.hasDetails()).toBe(false);
    });

    it('accepts an explicit message and details', () => {
        const details = new Uint8Array([1, 2, 3]);
        const status = new Status(StatusCode.INTERNAL, 'boom', details);

        expect(status.getMessage()).toBe('boom');
        expect(status.getDetails()).toEqual(details);
        expect(status.hasDetails()).toBe(true);
    });

    it('copies the details in and out so the caller cannot mutate them', () => {
        const details = new Uint8Array([1, 2, 3]);
        const status = new Status(StatusCode.INTERNAL, 'boom', details);

        details[0] = 9;

        const read = status.getDetails() as Uint8Array;

        read[1] = 8;

        expect(status.getDetails()).toEqual(new Uint8Array([1, 2, 3]));
    });

    it('classifies ok and cancellation outcomes', () => {
        expect(Status.ok().isOk()).toBe(true);
        expect(Status.ok().isCancellation()).toBe(false);
        expect(Status.cancelled().isCancellation()).toBe(true);
        expect(Status.deadlineExceeded().isCancellation()).toBe(true);
        expect(Status.internal().isOk()).toBe(false);
    });

    it('copies with a new code, message and details', () => {
        const status = new Status(StatusCode.OK, 'fine');

        expect(status.withCode(StatusCode.ABORTED).getCode()).toBe(StatusCode.ABORTED);
        expect(status.withCode(StatusCode.ABORTED).getMessage()).toBe('fine');
        expect(status.withMessage('other').getMessage()).toBe('other');
        expect(status.withMessage('other').getCode()).toBe(StatusCode.OK);
        expect(status.withDetails(new Uint8Array([7])).getDetails()).toEqual(new Uint8Array([7]));
        expect(status.withDetails(null).getDetails()).toBeNull();
    });

    it('builds from the of() factory with and without a message', () => {
        expect(Status.of(StatusCode.ABORTED).getMessage()).toBe('Aborted');
        expect(Status.of(StatusCode.ABORTED, 'stopped').getMessage()).toBe('stopped');
    });

    it.each([
        ['ok', Status.ok(), StatusCode.OK],
        ['cancelled', Status.cancelled(), StatusCode.CANCELLED],
        ['unknown', Status.unknown(), StatusCode.UNKNOWN],
        ['invalidArgument', Status.invalidArgument(), StatusCode.INVALID_ARGUMENT],
        ['deadlineExceeded', Status.deadlineExceeded(), StatusCode.DEADLINE_EXCEEDED],
        ['notFound', Status.notFound(), StatusCode.NOT_FOUND],
        ['alreadyExists', Status.alreadyExists(), StatusCode.ALREADY_EXISTS],
        ['permissionDenied', Status.permissionDenied(), StatusCode.PERMISSION_DENIED],
        ['resourceExhausted', Status.resourceExhausted(), StatusCode.RESOURCE_EXHAUSTED],
        ['failedPrecondition', Status.failedPrecondition(), StatusCode.FAILED_PRECONDITION],
        ['aborted', Status.aborted(), StatusCode.ABORTED],
        ['outOfRange', Status.outOfRange(), StatusCode.OUT_OF_RANGE],
        ['unimplemented', Status.unimplemented(), StatusCode.UNIMPLEMENTED],
        ['internal', Status.internal(), StatusCode.INTERNAL],
        ['unavailable', Status.unavailable(), StatusCode.UNAVAILABLE],
        ['dataLoss', Status.dataLoss(), StatusCode.DATA_LOSS],
        ['unauthenticated', Status.unauthenticated(), StatusCode.UNAUTHENTICATED],
    ])('exposes a %s factory', (_name, status, code) => {
        expect(status.getCode()).toBe(code);
        expect(status.getMessage()).toBe(new Status(code).getMessage());
    });

    it.each([
        ['cancelled', Status.cancelled('stopped')],
        ['unknown', Status.unknown('stopped')],
        ['invalidArgument', Status.invalidArgument('stopped')],
        ['deadlineExceeded', Status.deadlineExceeded('stopped')],
        ['notFound', Status.notFound('stopped')],
        ['alreadyExists', Status.alreadyExists('stopped')],
        ['permissionDenied', Status.permissionDenied('stopped')],
        ['resourceExhausted', Status.resourceExhausted('stopped')],
        ['failedPrecondition', Status.failedPrecondition('stopped')],
        ['aborted', Status.aborted('stopped')],
        ['outOfRange', Status.outOfRange('stopped')],
        ['unimplemented', Status.unimplemented('stopped')],
        ['internal', Status.internal('stopped')],
        ['unavailable', Status.unavailable('stopped')],
        ['dataLoss', Status.dataLoss('stopped')],
        ['unauthenticated', Status.unauthenticated('stopped')],
    ])('lets the %s factory carry an explicit message', (_name, status) => {
        expect(status.getMessage()).toBe('stopped');
    });

    it('carries rich error details on the internal factory', () => {
        const details = new Uint8Array([4, 5]);

        expect(Status.internal('boom', details).getDetails()).toEqual(details);
        expect(Status.internal(null, details).getMessage()).toBe('Internal error');
    });
});
