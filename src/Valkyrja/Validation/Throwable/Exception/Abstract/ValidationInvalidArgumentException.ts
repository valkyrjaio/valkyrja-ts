/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';
import type { ValidationThrowable } from '../../Contract/ValidationThrowable.ts';

export abstract class ValidationInvalidArgumentException
    extends ValkyrjaInvalidArgumentException
    implements ValidationThrowable {}
