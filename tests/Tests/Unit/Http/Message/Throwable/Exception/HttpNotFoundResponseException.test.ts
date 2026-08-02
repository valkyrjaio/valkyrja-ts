/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '../../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { HttpNotFoundResponseException } from '../../../../../../../src/Valkyrja/Http/Message/Throwable/Exception/HttpNotFoundResponseException.ts';

describe('HttpNotFoundResponseException', () => {
    it('defaults to a 404 status code', () => {
        expect(new HttpNotFoundResponseException().getStatusCode()).toBe(StatusCode.NOT_FOUND);
    });
});
