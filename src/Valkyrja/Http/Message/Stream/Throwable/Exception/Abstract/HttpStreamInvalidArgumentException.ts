/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpStreamThrowable } from '../../Contract/HttpStreamThrowable.ts';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.ts';

export abstract class HttpStreamInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements HttpStreamThrowable {}
