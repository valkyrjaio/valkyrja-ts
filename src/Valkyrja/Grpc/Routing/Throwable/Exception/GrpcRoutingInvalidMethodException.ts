/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcRoutingRuntimeException } from './Abstract/GrpcRoutingRuntimeException.ts';

/**
 * Thrown when a gRPC method name is not the fully-qualified `/package.Service/Method` form, or when
 * the service map holds no route for it.
 */
export class GrpcRoutingInvalidMethodException extends GrpcRoutingRuntimeException {}
