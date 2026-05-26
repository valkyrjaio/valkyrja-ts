/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpMessageThrowable } from '../../Contract/HttpMessageThrowable.js';
import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

export abstract class HttpMessageInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpMessageThrowable {}
