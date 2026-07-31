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
 * Thrown when a streaming handler pushes a message while another push is still in flight. Sends are
 * serialized and the transport is not safe against interleaving, so an overlapping push fails fast
 * rather than silently corrupting the wire framing.
 */
export class GrpcConcurrentSendException extends GrpcRuntimeException {}
