/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.ts';

import type { HttpClientThrowable } from '../../Contract/HttpClientThrowable.ts';

export abstract class HttpClientInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpClientThrowable {}
