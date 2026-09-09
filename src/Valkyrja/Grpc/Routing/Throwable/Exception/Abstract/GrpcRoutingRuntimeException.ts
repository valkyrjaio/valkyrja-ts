/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcRoutingThrowable } from '../../Contract/GrpcRoutingThrowable.ts';
import { GrpcRuntimeException } from '../../../../Throwable/Exception/Abstract/GrpcRuntimeException.ts';

export abstract class GrpcRoutingRuntimeException extends GrpcRuntimeException implements GrpcRoutingThrowable {}
