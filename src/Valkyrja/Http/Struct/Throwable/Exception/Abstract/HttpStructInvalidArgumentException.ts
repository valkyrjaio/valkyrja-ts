/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpStructThrowable } from '../../Contract/HttpStructThrowable.js';
import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.js';

export abstract class HttpStructInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpStructThrowable {}
