/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { CancelledException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/CancelledException.ts';
import { GrpcConcurrentSendException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/GrpcConcurrentSendException.ts';
import { GrpcInvalidStatusCodeException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/GrpcInvalidStatusCodeException.ts';
import { GrpcNonStreamingSendException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/GrpcNonStreamingSendException.ts';
import { MetadataInvalidKeyException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/MetadataInvalidKeyException.ts';
import { MetadataInvalidValueException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/MetadataInvalidValueException.ts';

describe('CancelledException', () => {
    it('carries its message and no reason by default', () => {
        const exception = new CancelledException('stopped');

        expect(exception.message).toBe('stopped');
        expect(exception.getReason()).toBeNull();
        expect(exception.getTraceCode()).toEqual(expect.any(String));
    });

    it('carries the cancellation reason it was given', () => {
        expect(new CancelledException('stopped', CancellationReason.DEADLINE_EXCEEDED).getReason()).toBe(
            CancellationReason.DEADLINE_EXCEEDED,
        );
    });
});

describe('Grpc exceptions', () => {
    it.each([
        ['GrpcConcurrentSendException', new GrpcConcurrentSendException('overlapping')],
        ['GrpcInvalidStatusCodeException', new GrpcInvalidStatusCodeException('unknown code')],
        ['GrpcNonStreamingSendException', new GrpcNonStreamingSendException('not streaming')],
        ['MetadataInvalidKeyException', new MetadataInvalidKeyException('bad key')],
        ['MetadataInvalidValueException', new MetadataInvalidValueException('bad value')],
    ])('%s is a throwable carrying its message', (_name, exception) => {
        expect(exception).toBeInstanceOf(Error);
        expect(exception.getTraceCode()).toEqual(expect.any(String));
    });
});
