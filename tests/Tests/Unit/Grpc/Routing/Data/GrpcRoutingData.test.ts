/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { GrpcRoutingData } from '../../../../../../src/Valkyrja/Grpc/Routing/Data/GrpcRoutingData.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

describe('GrpcRoutingData', () => {
    it('defaults to an empty service map, so an app works with no generated cache', () => {
        expect(new GrpcRoutingData().routes).toEqual({});
    });

    it('holds route suppliers keyed by fully-qualified method', () => {
        const route = RouteFixture.make();
        const data = new GrpcRoutingData({ '/pkg.Service/Method': () => route });

        expect(data.routes['/pkg.Service/Method']?.()).toBe(route);
    });
});
