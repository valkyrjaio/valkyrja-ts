/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpUriThrowable } from '../../Contract/HttpUriThrowable.ts';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.ts';

export abstract class HttpUriInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements HttpUriThrowable {}
