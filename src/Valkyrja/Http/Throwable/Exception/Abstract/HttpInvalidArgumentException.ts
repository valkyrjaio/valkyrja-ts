/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { HttpThrowable } from '../../Contract/HttpThrowable.ts';
import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';

export abstract class HttpInvalidArgumentException extends ValkyrjaInvalidArgumentException implements HttpThrowable {}
