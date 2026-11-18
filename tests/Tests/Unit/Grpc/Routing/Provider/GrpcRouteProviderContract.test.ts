/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { GrpcRouteProviderContract } from '../../../../../../src/Valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

describe('GrpcRouteProviderContract', () => {
    it('recognizes a route provider', () => {
        expect(GrpcRouteProviderContract.instanceOf({ getRoutes: () => [RouteFixture.make()] })).toBe(true);
    });

    it.each([[null], [undefined], ['a string'], [42], [{}]])('rejects the non-provider %j', (value) => {
        expect(GrpcRouteProviderContract.instanceOf(value)).toBe(false);
    });
});
