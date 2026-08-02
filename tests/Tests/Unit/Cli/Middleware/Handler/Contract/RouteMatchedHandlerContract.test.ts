/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteMatchedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/RouteMatchedHandlerContract.ts';

describe('RouteMatchedHandlerContract', () => {
    it('instanceOf is true for an object exposing routeMatched', () => {
        expect(RouteMatchedHandlerContract.instanceOf({ routeMatched: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteMatchedHandlerContract.instanceOf(null)).toBe(false);
        expect(RouteMatchedHandlerContract.instanceOf({})).toBe(false);
    });
});
