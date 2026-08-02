/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
