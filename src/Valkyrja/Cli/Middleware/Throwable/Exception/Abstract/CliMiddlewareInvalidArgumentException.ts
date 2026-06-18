/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.ts';

import type { CliMiddlewareThrowable } from '../../Contract/CliMiddlewareThrowable.ts';

export abstract class CliMiddlewareInvalidArgumentException
    extends CliInvalidArgumentException
    implements CliMiddlewareThrowable {}
