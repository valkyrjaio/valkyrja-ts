/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

import type { HttpMiddlewareThrowable } from '../../Contract/HttpMiddlewareThrowable.js';

export abstract class HttpMiddlewareInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpMiddlewareThrowable {}
