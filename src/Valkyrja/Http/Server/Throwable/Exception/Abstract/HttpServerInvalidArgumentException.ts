/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

import type { HttpServerThrowable } from '../../Contract/HttpServerThrowable.js';

export abstract class HttpServerInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpServerThrowable {}
