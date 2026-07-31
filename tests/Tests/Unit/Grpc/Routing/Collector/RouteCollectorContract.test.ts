/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RouteCollectorContract } from '../../../../../../src/Valkyrja/Grpc/Routing/Collector/Contract/RouteCollectorContract.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

describe('RouteCollectorContract', () => {
    it('recognizes a collector', () => {
        expect(RouteCollectorContract.instanceOf({ getRoutes: () => [RouteFixture.make()] })).toBe(true);
    });

    it.each([[null], [undefined], ['a string'], [42], [{}]])('rejects the non-collector %j', (value) => {
        expect(RouteCollectorContract.instanceOf(value)).toBe(false);
    });
});
