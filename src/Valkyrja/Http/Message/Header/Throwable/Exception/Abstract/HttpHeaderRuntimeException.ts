/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpHeaderThrowable } from '../../Contract/HttpHeaderThrowable.js';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.js';

export abstract class HttpHeaderRuntimeException extends HttpMessageRuntimeException implements HttpHeaderThrowable {}
