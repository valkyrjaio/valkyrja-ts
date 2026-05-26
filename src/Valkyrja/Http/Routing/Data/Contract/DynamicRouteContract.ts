/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ParameterContract } from './ParameterContract.js';
import type { RouteContract } from './RouteContract.js';

export interface DynamicRouteContract extends RouteContract {
    getRegex(): string;
    withRegex(regex: string): this;
    getParameters(): ParameterContract[];
    withParameters(...parameters: ParameterContract[]): this;
    withAddedParameters(...parameters: ParameterContract[]): this;
}
