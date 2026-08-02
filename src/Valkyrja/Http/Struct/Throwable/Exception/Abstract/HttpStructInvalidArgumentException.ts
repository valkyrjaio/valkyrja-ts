/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpStructThrowable } from '../../Contract/HttpStructThrowable.ts';
import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.ts';

export abstract class HttpStructInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpStructThrowable {}
