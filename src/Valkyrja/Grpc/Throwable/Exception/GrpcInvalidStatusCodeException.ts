/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcInvalidArgumentException } from './Abstract/GrpcInvalidArgumentException.ts';

/**
 * Thrown when an integer taken off the wire does not name a gRPC status code. The `grpc-status`
 * trailer carries 0–16; anything else is a malformed peer, not a status this framework can act on.
 */
export class GrpcInvalidStatusCodeException extends GrpcInvalidArgumentException {}
