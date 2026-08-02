/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ThrowableHandler } from '../../../../../../src/Valkyrja/Throwable/Handler/Abstract/ThrowableHandler.ts';

describe('ThrowableHandler', () => {
    it('builds a trace code from an error with a stack', () => {
        const code = ThrowableHandler.getTraceCode(new Error('boom'));

        expect(code).toMatch(/^[0-9a-f]{32}$/);
    });

    it('builds a trace code from an error without a stack', () => {
        const error = new Error('boom');
        Object.defineProperty(error, 'stack', { value: undefined });

        const code = ThrowableHandler.getTraceCode(error);

        expect(code).toMatch(/^[0-9a-f]{32}$/);
    });
});
