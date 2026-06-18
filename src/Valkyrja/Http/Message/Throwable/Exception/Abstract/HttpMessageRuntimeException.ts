/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpMessageThrowable } from '../../Contract/HttpMessageThrowable.ts';
import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.ts';

export abstract class HttpMessageRuntimeException extends HttpRuntimeException implements HttpMessageThrowable {}
