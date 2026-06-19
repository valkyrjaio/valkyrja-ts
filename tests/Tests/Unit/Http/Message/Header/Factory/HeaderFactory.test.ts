/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HeaderFactory } from '../../../../../../../src/Valkyrja/Http/Message/Header/Factory/HeaderFactory.ts';
import { HttpHeaderInvalidNameException } from '../../../../../../../src/Valkyrja/Http/Message/Header/Throwable/Exception/HttpHeaderInvalidNameException.ts';
import { HttpHeaderInvalidValueException } from '../../../../../../../src/Valkyrja/Http/Message/Header/Throwable/Exception/HttpHeaderInvalidValueException.ts';

describe('HeaderFactory', () => {
    it('marshals HTTP_ and content headers from server values', () => {
        const headers = HeaderFactory.marshalHeaders({
            HTTP_ACCEPT: 'text/html',
            CONTENT_TYPE: 'application/json',
            CONTENT_LENGTH: 42,
            REQUEST_METHOD: 'GET',
        });

        expect(headers).toStrictEqual({
            accept: 'text/html',
            'content-type': 'application/json',
            'content-length': '42',
        });
    });

    it('strips control characters but keeps obs-fold whitespace', () => {
        expect(HeaderFactory.filterValue('he\x00llo')).toBe('hello');
        expect(HeaderFactory.filterValue('line\r\n\tcont')).toBe('line\r\n\tcont');
    });

    it('validates header values', () => {
        expect(HeaderFactory.isValidValue('text/html')).toBe(true);
        expect(HeaderFactory.isValidValue('bad\nvalue')).toBe(false);
        expect(HeaderFactory.isValidValue('bad\x01value')).toBe(false);
        expect(() => HeaderFactory.assertValidValue('bad\nvalue')).toThrow(HttpHeaderInvalidValueException);
    });

    it('validates header names', () => {
        expect(HeaderFactory.isValidName('Content-Type')).toBe(true);
        expect(HeaderFactory.isValidName('')).toBe(false);
        expect(HeaderFactory.isValidName('Bad Name')).toBe(false);
        expect(() => HeaderFactory.assertValidName('Bad Name')).toThrow(HttpHeaderInvalidNameException);
    });
});
