/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventRuntimeException } from '../../../../../../../src/Valkyrja/Event/Throwable/Exception/Abstract/EventRuntimeException.ts';

// The component ships this base even while nothing extends it, and the taxonomy
// requires it. A concrete subclass here is what reaches the base at runtime.
class ConcreteEventRuntimeException extends EventRuntimeException {}

describe('EventRuntimeException', () => {
    it('carries the message that a subclass gives it', () => {
        const exception = new ConcreteEventRuntimeException('the failure');

        expect(exception.message).toBe('the failure');
        expect(exception).toBeInstanceOf(Error);
    });

    it('produces a stable hex trace code', () => {
        const exception = new ConcreteEventRuntimeException('the failure');

        const traceCode = exception.getTraceCode();

        expect(traceCode).toMatch(/^[0-9a-f]{32}$/);
        expect(exception.getTraceCode()).toBe(traceCode);
    });
});
