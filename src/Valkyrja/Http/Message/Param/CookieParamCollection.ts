/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CookieParamCollectionContract } from './Contract/CookieParamCollectionContract.ts';
import { ParamCollection } from './Abstract/ParamCollection.ts';

export class CookieParamCollection extends ParamCollection<string> implements CookieParamCollectionContract {}
