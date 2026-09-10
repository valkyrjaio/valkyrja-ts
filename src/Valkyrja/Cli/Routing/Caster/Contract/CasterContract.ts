/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ParameterContract } from '../../Data/Contract/ParameterContract.ts';

export interface CasterContract {
    getCastValues(parameter: ParameterContract): unknown[];
}
