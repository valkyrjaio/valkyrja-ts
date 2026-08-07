/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventInvalidArgumentException } from '../../../../../../src/Valkyrja/Event/Throwable/Exception/Abstract/EventInvalidArgumentException.ts';
import { EventInvalidEventException } from '../../../../../../src/Valkyrja/Event/Throwable/Exception/EventInvalidEventException.ts';

describe('EventInvalidEventException', () => {
    it('builds the not-an-event message for the given id', () => {
        const id = 'SomeEventId';

        const exception = new EventInvalidEventException(id);

        expect(exception.message).toBe(`Service with \`${id}\` is not an event`);
        expect(exception.id).toBe(id);
        expect(exception.name).toBe('EventInvalidEventException');
    });

    it('extends the component invalid argument base', () => {
        expect(new EventInvalidEventException('SomeEventId')).toBeInstanceOf(EventInvalidArgumentException);
    });

    it('keeps the cause that it was given', () => {
        const cause = new Error('the cause');

        const exception = new EventInvalidEventException('SomeEventId', { cause });

        expect(exception.cause).toBe(cause);
    });

    it('produces a stable hex trace code', () => {
        const exception = new EventInvalidEventException('SomeEventId');

        const traceCode = exception.getTraceCode();

        expect(traceCode).toMatch(/^[0-9a-f]{32}$/);
        expect(exception.getTraceCode()).toBe(traceCode);
    });
});
