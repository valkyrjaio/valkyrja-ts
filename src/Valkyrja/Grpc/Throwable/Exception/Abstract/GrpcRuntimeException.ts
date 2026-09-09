/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { GrpcThrowable } from '../../Contract/GrpcThrowable.ts';
import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.ts';

export abstract class GrpcRuntimeException extends ValkyrjaRuntimeException implements GrpcThrowable {}
