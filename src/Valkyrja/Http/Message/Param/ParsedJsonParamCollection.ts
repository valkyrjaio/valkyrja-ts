/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ParsedJsonParamCollectionContract } from './Contract/ParsedJsonParamCollectionContract.ts';
import { ParamCollection } from './Abstract/ParamCollection.ts';

export class ParsedJsonParamCollection extends ParamCollection implements ParsedJsonParamCollectionContract {}
