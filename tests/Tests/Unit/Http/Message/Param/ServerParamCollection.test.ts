/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ServerParamCollection } from '../../../../../../src/Valkyrja/Http/Message/Param/ServerParamCollection.ts';

describe('ServerParamCollection', () => {
    it('defaults to an empty collection and stores parameters', () => {
        expect(new ServerParamCollection().getAll()).toStrictEqual({});
        expect(new ServerParamCollection({ a: 1 } as never).get('a')).toBe(1);
    });
});
