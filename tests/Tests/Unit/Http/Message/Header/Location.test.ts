/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HeaderName } from '../../../../../../src/Valkyrja/Http/Message/Constant/HeaderName.ts';
import { Location } from '../../../../../../src/Valkyrja/Http/Message/Header/Location.ts';

describe('Location', () => {
    it('uses the location header name and carries its value', () => {
        const header = new Location('/home');

        expect(header.getName()).toBe(HeaderName.LOCATION);
        expect(header.getValues()).toStrictEqual(['/home']);
    });
});
