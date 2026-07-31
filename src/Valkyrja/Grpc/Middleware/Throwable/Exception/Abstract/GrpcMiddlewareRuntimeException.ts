/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { GrpcMiddlewareThrowable } from '../../Contract/GrpcMiddlewareThrowable.ts';
import { GrpcRuntimeException } from '../../../../Throwable/Exception/Abstract/GrpcRuntimeException.ts';

export abstract class GrpcMiddlewareRuntimeException extends GrpcRuntimeException implements GrpcMiddlewareThrowable {}
