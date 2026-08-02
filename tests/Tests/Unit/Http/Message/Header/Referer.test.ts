/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { Referer } from '../../../../../../src/Valkyrja/Http/Message/Header/Referer.ts';

describe('Referer', () => {
    it('uses the referer header name and carries its value', () => {
        const header = new Referer('https://example.com');

        expect(header.getName()).toBe(HeaderName.REFERER);
        expect(header.getValues()).toStrictEqual(['https://example.com']);
    });
});
