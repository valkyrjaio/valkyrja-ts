/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcMiddlewareThrowable } from '../../Contract/GrpcMiddlewareThrowable.ts';
import { GrpcInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/GrpcInvalidArgumentException.ts';

export abstract class GrpcMiddlewareInvalidArgumentException
    extends GrpcInvalidArgumentException
    implements GrpcMiddlewareThrowable {}
