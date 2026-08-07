/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
