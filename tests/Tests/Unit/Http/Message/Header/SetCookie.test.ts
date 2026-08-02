/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { SetCookie } from '../../../../../../src/Valkyrja/Http/Message/Header/SetCookie.ts';
import { Cookie } from '../../../../../../src/Valkyrja/Http/Message/Header/Value/Cookie.ts';

describe('SetCookie', () => {
    it('uses the set-cookie header name and carries cookies', () => {
        const header = new SetCookie(new Cookie('session', 'abc'));

        expect(header.getName()).toBe(HeaderName.SET_COOKIE);
        expect(header.getValues()).toHaveLength(1);
    });
});
