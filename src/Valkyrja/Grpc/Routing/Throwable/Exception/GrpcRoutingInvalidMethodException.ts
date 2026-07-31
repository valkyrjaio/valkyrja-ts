/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcRoutingRuntimeException } from './Abstract/GrpcRoutingRuntimeException.ts';

/**
 * Thrown when a gRPC method name is not the fully-qualified `/package.Service/Method` form, or when
 * the service map holds no route for it.
 */
export class GrpcRoutingInvalidMethodException extends GrpcRoutingRuntimeException {}
