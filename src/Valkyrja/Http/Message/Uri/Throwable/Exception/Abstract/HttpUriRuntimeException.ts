/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpUriThrowable } from '../../Contract/HttpUriThrowable.ts';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.ts';

export abstract class HttpUriRuntimeException extends HttpMessageRuntimeException implements HttpUriThrowable {}
