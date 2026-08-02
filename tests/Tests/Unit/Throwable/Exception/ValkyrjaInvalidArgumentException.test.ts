/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ContainerInvalidReferenceException } from '../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidReferenceException.ts';

describe('ValkyrjaInvalidArgumentException', () => {
    it('produces a stable hex trace code for a concrete subclass', () => {
        const exception = new ContainerInvalidReferenceException('SomeServiceId');

        const traceCode = exception.getTraceCode();

        expect(traceCode).toMatch(/^[0-9a-f]{32}$/);
        expect(exception.getTraceCode()).toBe(traceCode);
    });
});
