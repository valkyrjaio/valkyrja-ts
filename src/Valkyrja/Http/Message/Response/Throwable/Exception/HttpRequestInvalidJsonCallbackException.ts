/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpResponseInvalidArgumentException } from './Abstract/HttpResponseInvalidArgumentException.ts';

export class HttpRequestInvalidJsonCallbackException extends HttpResponseInvalidArgumentException {}
