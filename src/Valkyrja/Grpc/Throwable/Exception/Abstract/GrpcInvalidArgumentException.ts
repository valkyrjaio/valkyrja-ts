/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { GrpcThrowable } from '../../Contract/GrpcThrowable.ts';
import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';

export abstract class GrpcInvalidArgumentException extends ValkyrjaInvalidArgumentException implements GrpcThrowable {}
