/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcMiddlewareThrowable } from '../../Contract/GrpcMiddlewareThrowable.ts';
import { GrpcRuntimeException } from '../../../../Throwable/Exception/Abstract/GrpcRuntimeException.ts';

export abstract class GrpcMiddlewareRuntimeException extends GrpcRuntimeException implements GrpcMiddlewareThrowable {}
