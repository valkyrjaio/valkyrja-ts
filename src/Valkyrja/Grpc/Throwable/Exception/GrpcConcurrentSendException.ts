/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcRuntimeException } from './Abstract/GrpcRuntimeException.ts';

/**
 * Thrown when a streaming handler pushes a message while another push is still in flight. Sends are
 * serialized and the transport is not safe against interleaving, so an overlapping push fails fast
 * rather than silently corrupting the wire framing.
 */
export class GrpcConcurrentSendException extends GrpcRuntimeException {}
