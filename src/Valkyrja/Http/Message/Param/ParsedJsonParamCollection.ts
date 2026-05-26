/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ParsedJsonParamCollectionContract } from './Contract/ParsedJsonParamCollectionContract.js';
import { ParamCollection } from './Abstract/ParamCollection.js';

export class ParsedJsonParamCollection extends ParamCollection implements ParsedJsonParamCollectionContract {}
