/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.ts';

import type { HttpClientThrowable } from '../../Contract/HttpClientThrowable.ts';

export abstract class HttpClientRuntimeException extends HttpRuntimeException implements HttpClientThrowable {}
