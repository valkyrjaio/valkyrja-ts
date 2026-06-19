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
