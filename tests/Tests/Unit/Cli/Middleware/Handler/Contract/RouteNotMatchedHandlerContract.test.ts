/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteNotMatchedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteNotMatchedHandlerContract.ts';

describe('RouteNotMatchedHandlerContract', () => {
    it('instanceOf is true for an object exposing routeNotMatched', () => {
        expect(RouteNotMatchedHandlerContract.instanceOf({ routeNotMatched: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteNotMatchedHandlerContract.instanceOf(null)).toBe(false);
        expect(RouteNotMatchedHandlerContract.instanceOf({})).toBe(false);
    });
});
