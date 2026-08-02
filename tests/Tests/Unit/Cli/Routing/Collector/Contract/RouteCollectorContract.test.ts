/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteCollectorContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Collector/Contract/RouteCollectorContract.ts';

describe('RouteCollectorContract', () => {
    it('instanceOf is true for an object exposing getRoutes', () => {
        expect(RouteCollectorContract.instanceOf({ getRoutes: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(RouteCollectorContract.instanceOf(null)).toBe(false);
        expect(RouteCollectorContract.instanceOf({})).toBe(false);
    });
});
