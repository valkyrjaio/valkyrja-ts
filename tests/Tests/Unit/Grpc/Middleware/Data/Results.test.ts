/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ServiceResponse } from '../../../../../../src/Valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { CallReceivedResult } from '../../../../../../src/Valkyrja/Grpc/Middleware/Data/CallReceivedResult.ts';
import { RouteMatchedResult } from '../../../../../../src/Valkyrja/Grpc/Middleware/Data/RouteMatchedResult.ts';
import { ServiceCallFixture } from '../../../../Fixtures/Grpc/Message/ServiceCallFixture.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

describe('CallReceivedResult', () => {
    it('defaults to continuing the pipeline with no response', () => {
        const call = ServiceCallFixture.make();
        const result = new CallReceivedResult(call);

        expect(result.call).toBe(call);
        expect(result.response).toBeNull();
    });

    it('carries a short-circuiting response', () => {
        const response = ServiceResponse.ok();

        expect(new CallReceivedResult(ServiceCallFixture.make(), response).response).toBe(response);
    });
});

describe('RouteMatchedResult', () => {
    it('defaults to continuing the pipeline with no response', () => {
        const route = RouteFixture.make();
        const result = new RouteMatchedResult(route);

        expect(result.route).toBe(route);
        expect(result.response).toBeNull();
    });

    it('carries a short-circuiting response', () => {
        const response = ServiceResponse.ok();

        expect(new RouteMatchedResult(RouteFixture.make(), response).response).toBe(response);
    });
});
