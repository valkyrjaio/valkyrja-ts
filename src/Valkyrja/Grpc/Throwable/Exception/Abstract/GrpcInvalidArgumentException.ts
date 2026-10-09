/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcThrowable } from '../../Contract/GrpcThrowable.ts';
import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';

export abstract class GrpcInvalidArgumentException extends ValkyrjaInvalidArgumentException implements GrpcThrowable {}
