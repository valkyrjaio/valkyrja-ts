/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteDispatchedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/RouteDispatchedMiddlewareContract.ts';

describe('RouteDispatchedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing routeDispatched', () => {
        expect(RouteDispatchedMiddlewareContract.instanceOf({ routeDispatched: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteDispatchedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(RouteDispatchedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
