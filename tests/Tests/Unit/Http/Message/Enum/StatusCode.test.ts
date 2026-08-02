/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import {
    StatusCode,
    statusCodeAsPhrase,
    statusCodeIsError,
    statusCodeIsRedirect,
} from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusCode.ts';
import { StatusText } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusText.ts';

describe('StatusCode', () => {
    it('exposes well-known status code values', () => {
        expect(StatusCode.OK).toBe(200);
        expect(StatusCode.NOT_FOUND).toBe(404);
        expect(StatusCode.INTERNAL_SERVER_ERROR).toBe(500);
    });

    it('classifies redirect status codes', () => {
        expect(statusCodeIsRedirect(StatusCode.MOVED_PERMANENTLY)).toBe(true);
        expect(statusCodeIsRedirect(StatusCode.OK)).toBe(false);
    });

    it('classifies error status codes', () => {
        expect(statusCodeIsError(StatusCode.INTERNAL_SERVER_ERROR)).toBe(true);
        expect(statusCodeIsError(StatusCode.OK)).toBe(false);
    });

    it('maps a status code to its phrase', () => {
        expect(statusCodeAsPhrase(StatusCode.OK)).toBe(StatusText.OK);
        expect(statusCodeAsPhrase(StatusCode.NOT_FOUND)).toBe(StatusText.NOT_FOUND);
    });
});
