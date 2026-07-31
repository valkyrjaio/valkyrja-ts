/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcRuntimeException } from './Abstract/GrpcRuntimeException.ts';

/**
 * Thrown when a handler pushes a message on a buffered call. The push sink exists only under the
 * streaming model; a buffered call returns its messages on the `ServiceResponse` instead.
 */
export class GrpcNonStreamingSendException extends GrpcRuntimeException {}
