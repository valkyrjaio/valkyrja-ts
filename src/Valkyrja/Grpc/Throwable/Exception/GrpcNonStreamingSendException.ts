/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcRuntimeException } from './Abstract/GrpcRuntimeException.ts';

/**
 * Thrown when a handler pushes a message on a buffered call. The push sink exists only under the
 * streaming model; a buffered call returns its messages on the `ServiceResponse` instead.
 */
export class GrpcNonStreamingSendException extends GrpcRuntimeException {}
