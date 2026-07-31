/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { GrpcRoutingThrowable } from '../../Contract/GrpcRoutingThrowable.ts';
import { GrpcInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/GrpcInvalidArgumentException.ts';

export abstract class GrpcRoutingInvalidArgumentException
    extends GrpcInvalidArgumentException
    implements GrpcRoutingThrowable {}
