/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServerRequestContract } from './ServerRequestContract.ts';
import type { ParsedJsonParamCollectionContract } from '../../Param/Contract/ParsedJsonParamCollectionContract.ts';

export interface JsonServerRequestContract extends ServerRequestContract {
    getParsedJson(): ParsedJsonParamCollectionContract;
    withParsedJson(params: ParsedJsonParamCollectionContract): this;
}
