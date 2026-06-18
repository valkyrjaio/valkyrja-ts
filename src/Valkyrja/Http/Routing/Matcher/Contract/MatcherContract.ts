/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RequestMethod } from '../../../Message/Enum/RequestMethod.ts';
import type { RouteContract } from '../../Data/Contract/RouteContract.ts';

export interface MatcherContract {
    match(path: string, requestMethod: RequestMethod): RouteContract | null;
    matchStatic(path: string, requestMethod: RequestMethod): RouteContract | null;
    matchDynamic(path: string, requestMethod: RequestMethod): RouteContract | null;
}
