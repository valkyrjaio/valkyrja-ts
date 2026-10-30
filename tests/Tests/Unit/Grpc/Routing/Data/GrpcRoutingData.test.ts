/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
