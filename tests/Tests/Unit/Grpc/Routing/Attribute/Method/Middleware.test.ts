/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Middleware } from '../../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Method/Middleware.ts';
import { ensureGrpcRouteMetadata } from '../../../../../../../src/Valkyrja/Grpc/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { GrpcMiddlewareClass } from '../../../../../../../src/Valkyrja/Grpc/Routing/Attribute/RouteAttributeMetadata.ts';

describe('Grpc Method Middleware attribute', () => {
    it('records each middleware thunk and is repeatable', () => {
        const context = methodDecoratorContext('ping');
        const first = class {} as unknown as GrpcMiddlewareClass;
        const second = class {} as unknown as GrpcMiddlewareClass;

        Middleware(() => first)(undefined, context);
        Middleware(() => second)(undefined, context);

        expect(
            ensureGrpcRouteMetadata(context.metadata)
                .methods.get('ping')
                ?.middleware.map((thunk) => thunk()),
        ).toStrictEqual([first, second]);
    });
});
