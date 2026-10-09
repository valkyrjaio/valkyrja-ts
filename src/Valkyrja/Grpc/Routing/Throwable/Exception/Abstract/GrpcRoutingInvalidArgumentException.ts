/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcRoutingThrowable } from '../../Contract/GrpcRoutingThrowable.ts';
import { GrpcInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/GrpcInvalidArgumentException.ts';

export abstract class GrpcRoutingInvalidArgumentException
    extends GrpcInvalidArgumentException
    implements GrpcRoutingThrowable {}
