/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcInvalidArgumentException } from './Abstract/GrpcInvalidArgumentException.ts';

/**
 * Thrown when an integer taken off the wire does not name a gRPC status code. The `grpc-status`
 * trailer carries 0–16; anything else is a malformed peer, not a status this framework can act on.
 */
export class GrpcInvalidStatusCodeException extends GrpcInvalidArgumentException {}
