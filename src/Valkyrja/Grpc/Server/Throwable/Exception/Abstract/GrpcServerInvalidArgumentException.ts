/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/GrpcInvalidArgumentException.ts';

import type { GrpcServerThrowable } from '../../Contract/GrpcServerThrowable.ts';

export abstract class GrpcServerInvalidArgumentException
    extends GrpcInvalidArgumentException
    implements GrpcServerThrowable {}
