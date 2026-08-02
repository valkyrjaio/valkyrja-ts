/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ensureGrpcRouteMetadata } from './RouteAttributeMetadata.ts';

/**
 * Declare a gRPC service on a controller class.
 *
 * The scan builds the service map from the `@Method` decorators in the controller. Each route is
 * keyed `/service/methodName`. `sindri` reads the decorator statically to build the cache. On the
 * debug path the runtime `AttributeRouteCollector` reads the same decorator from the class metadata.
 */
export function Service(service: string) {
    return function (_value: unknown, context: ClassDecoratorContext): void {
        ensureGrpcRouteMetadata(context.metadata).services.push(service);
    };
}
