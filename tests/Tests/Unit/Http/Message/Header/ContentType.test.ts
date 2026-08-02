/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { ContentType } from '../../../../../../src/Valkyrja/Http/Message/Header/ContentType.ts';

describe('ContentType', () => {
    it('uses the content-type header name and carries its value', () => {
        const header = new ContentType('text/html');

        expect(header.getName()).toBe(HeaderName.CONTENT_TYPE);
        expect(header.getValues()).toStrictEqual(['text/html']);
    });
});
