/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.ts';

import type { HttpServerThrowable } from '../../Contract/HttpServerThrowable.ts';

export abstract class HttpServerRuntimeException extends HttpRuntimeException implements HttpServerThrowable {}
