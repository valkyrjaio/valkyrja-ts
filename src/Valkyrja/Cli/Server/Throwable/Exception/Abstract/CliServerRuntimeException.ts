/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliRuntimeException } from '../../../../Throwable/Exception/Abstract/CliRuntimeException.js';

import type { CliServerThrowable } from '../../Contract/CliServerThrowable.js';

export abstract class CliServerRuntimeException extends CliRuntimeException implements CliServerThrowable {}
