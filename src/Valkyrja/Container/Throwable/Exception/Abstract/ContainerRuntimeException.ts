/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.ts';

import { type ContainerThrowable } from '../../Contract/ContainerThrowable.ts';

export abstract class ContainerRuntimeException extends ValkyrjaRuntimeException implements ContainerThrowable {}
