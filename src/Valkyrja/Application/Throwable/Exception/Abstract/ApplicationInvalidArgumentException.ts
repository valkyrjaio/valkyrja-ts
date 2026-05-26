/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.js';

import type { ApplicationThrowable } from '../../Contract/ApplicationThrowable.js';

export abstract class ApplicationInvalidArgumentException
    extends ValkyrjaInvalidArgumentException
    implements ApplicationThrowable {}
