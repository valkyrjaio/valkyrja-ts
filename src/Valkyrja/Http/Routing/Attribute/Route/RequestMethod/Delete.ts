/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RequestMethod as RequestMethodEnum } from '../../../../Message/Enum/RequestMethod.ts';
import { RequestMethod } from '../RequestMethod.ts';

/**
 * Add the DELETE request method to the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[Delete]`.
 */
export function Delete() {
    return RequestMethod(RequestMethodEnum.DELETE);
}
