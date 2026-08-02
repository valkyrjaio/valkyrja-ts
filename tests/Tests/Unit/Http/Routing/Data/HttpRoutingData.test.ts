/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HttpRoutingData } from '../../../../../../src/Valkyrja/Http/Routing/Data/HttpRoutingData.ts';

describe('HttpRoutingData', () => {
    it('defaults to empty routes, paths, dynamic paths, and regexes', () => {
        const data = new HttpRoutingData();

        expect(data.routes).toStrictEqual({});
        expect(data.paths).toStrictEqual({});
        expect(data.dynamicPaths).toStrictEqual({});
        expect(data.regexes).toStrictEqual({});
    });

    it('stores the provided routing data', () => {
        const data = new HttpRoutingData({}, { GET: { '/': 'home' } });

        expect(data.paths).toStrictEqual({ GET: { '/': 'home' } });
    });
});
