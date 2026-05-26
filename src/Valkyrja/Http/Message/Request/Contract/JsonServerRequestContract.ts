/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServerRequestContract } from './ServerRequestContract.js';
import type { ParsedJsonParamCollectionContract } from '../../Param/Contract/ParsedJsonParamCollectionContract.js';

export interface JsonServerRequestContract extends ServerRequestContract {
    getParsedJson(): ParsedJsonParamCollectionContract;
    withParsedJson(params: ParsedJsonParamCollectionContract): this;
}
