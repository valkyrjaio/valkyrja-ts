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
 * Thrown when metadata is added under a key that is not a valid gRPC header name. Raised at the
 * point of insertion — as HTTP does for invalid header names — so a malformed key fails fast in the
 * handler rather than surfacing as an opaque transport error when the response is written.
 */
export class MetadataInvalidKeyException extends GrpcRuntimeException {}
