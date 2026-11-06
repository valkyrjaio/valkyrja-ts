/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ensureGrpcRouteMetadata } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/RouteAttributeMetadata.ts';
import { Service } from '../../../../../../src/Valkyrja/Grpc/Routing/Attribute/Service.ts';
import { classDecoratorContext } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Grpc Service attribute', () => {
    it('records the service name on the class metadata', () => {
        const context = classDecoratorContext('PingController');

        Service('pkg.Ping')(undefined, context);

        expect(ensureGrpcRouteMetadata(context.metadata).services).toStrictEqual(['pkg.Ping']);
    });
});
