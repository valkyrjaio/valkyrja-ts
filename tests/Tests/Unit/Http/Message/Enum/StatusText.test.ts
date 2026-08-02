/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StatusText } from '../../../../../../src/Valkyrja/Http/Message/Enum/StatusText.ts';

describe('StatusText', () => {
    it('exposes well-known status phrases', () => {
        expect(StatusText.OK).toBe('OK');
        expect(StatusText.NOT_FOUND).toBe('Not Found');
        expect(StatusText.INTERNAL_SERVER_ERROR).toBe('Internal Server Error');
    });
});
