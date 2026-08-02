/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ContainerInvalidReferenceException } from '../../../../../../src/Valkyrja/Container/Throwable/Exception/ContainerInvalidReferenceException.ts';

describe('ContainerInvalidReferenceException', () => {
    it('builds the not-found message for the given id', () => {
        const id = 'SomeServiceId';

        const exception = new ContainerInvalidReferenceException(id);

        expect(exception.message).toBe(`Service with \`${id}\` not found`);
    });
});
