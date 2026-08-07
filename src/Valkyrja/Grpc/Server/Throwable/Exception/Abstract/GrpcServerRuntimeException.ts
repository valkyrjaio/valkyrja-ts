/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcRuntimeException } from '../../../../Throwable/Exception/Abstract/GrpcRuntimeException.ts';

import type { GrpcServerThrowable } from '../../Contract/GrpcServerThrowable.ts';

export abstract class GrpcServerRuntimeException extends GrpcRuntimeException implements GrpcServerThrowable {}
