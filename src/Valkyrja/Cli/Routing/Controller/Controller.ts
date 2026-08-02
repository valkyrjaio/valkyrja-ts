/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { InputContract } from '../../Interaction/Input/Contract/InputContract.ts';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.ts';

export abstract class Controller {
    constructor(
        protected input: InputContract,
        protected outputFactory: OutputFactoryContract,
    ) {}
}
