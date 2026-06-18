/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';

import type { CliThrowable } from '../../Contract/CliThrowable.ts';

export abstract class CliInvalidArgumentException extends ValkyrjaInvalidArgumentException implements CliThrowable {}
