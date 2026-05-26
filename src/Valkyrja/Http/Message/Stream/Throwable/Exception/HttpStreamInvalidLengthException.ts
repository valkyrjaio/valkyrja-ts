/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpStreamInvalidArgumentException } from './Abstract/HttpStreamInvalidArgumentException.js';

export class HttpStreamInvalidLengthException extends HttpStreamInvalidArgumentException {}
