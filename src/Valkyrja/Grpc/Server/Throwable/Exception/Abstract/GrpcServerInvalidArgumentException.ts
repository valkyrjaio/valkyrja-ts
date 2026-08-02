/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/GrpcInvalidArgumentException.ts';

import type { GrpcServerThrowable } from '../../Contract/GrpcServerThrowable.ts';

export abstract class GrpcServerInvalidArgumentException
    extends GrpcInvalidArgumentException
    implements GrpcServerThrowable {}
