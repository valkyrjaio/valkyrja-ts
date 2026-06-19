/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpRouteProviderContract } from '../../../../../../../src/Valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

describe('HttpRouteProviderContract', () => {
    it('instanceOf is true for an object exposing getRoutes', () => {
        expect(HttpRouteProviderContract.instanceOf({ getRoutes: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(HttpRouteProviderContract.instanceOf(null)).toBe(false);
        expect(HttpRouteProviderContract.instanceOf({})).toBe(false);
    });
});
