/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from '../../../Message/Request/Contract/ServerRequestContract.ts';
import type { StructContract } from '../../Contract/StructContract.ts';

export interface RequestStructContract extends StructContract {
    getDataFromRequest(request: ServerRequestContract): Record<string, unknown>;
    determineIfRequestContainsExtraData(request: ServerRequestContract): boolean;
}
