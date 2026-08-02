/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RequestMethod as RequestMethodEnum } from '../../../../Message/Enum/RequestMethod.ts';
import { RequestMethod } from '../RequestMethod.ts';

/**
 * Add the POST request method to the route(s) declared on a controller method.
 *
 * Mirrors PHP's `#[Post]`.
 */
export function Post() {
    return RequestMethod(RequestMethodEnum.POST);
}
