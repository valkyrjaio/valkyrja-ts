/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Method } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Method.ts';
import { ensureGrpcRouteMetadata } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Grpc Method attribute', () => {
    it('records a method definition and is repeatable', () => {
        const context = methodDecoratorContext('ping');

        Method({ name: 'Ping' })(undefined, context);
        Method({ name: 'PingAlias' })(undefined, context);

        expect(
            ensureGrpcRouteMetadata(context.metadata)
                .methods.get('ping')
                ?.methods.map((method) => method.name),
        ).toStrictEqual(['Ping', 'PingAlias']);
    });
});
