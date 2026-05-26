/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.js';

import type { CliRoutingThrowable } from '../../Contract/CliRoutingThrowable.js';

export abstract class CliRoutingInvalidArgumentException
    extends CliInvalidArgumentException
    implements CliRoutingThrowable {}
