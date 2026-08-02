/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliRuntimeException } from '../../../../Throwable/Exception/Abstract/CliRuntimeException.ts';

import type { CliRoutingThrowable } from '../../Contract/CliRoutingThrowable.ts';

export abstract class CliRoutingRuntimeException extends CliRuntimeException implements CliRoutingThrowable {}
