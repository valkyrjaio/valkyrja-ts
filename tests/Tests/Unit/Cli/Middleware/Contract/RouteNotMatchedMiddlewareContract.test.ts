/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteNotMatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteNotMatchedMiddlewareContract.ts';

describe('RouteNotMatchedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing routeNotMatched', () => {
        expect(RouteNotMatchedMiddlewareContract.instanceOf({ routeNotMatched: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteNotMatchedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(RouteNotMatchedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
