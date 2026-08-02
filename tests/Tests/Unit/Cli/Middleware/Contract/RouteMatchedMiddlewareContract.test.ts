/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteMatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteMatchedMiddlewareContract.ts';

describe('RouteMatchedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing routeMatched', () => {
        expect(RouteMatchedMiddlewareContract.instanceOf({ routeMatched: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteMatchedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(RouteMatchedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
