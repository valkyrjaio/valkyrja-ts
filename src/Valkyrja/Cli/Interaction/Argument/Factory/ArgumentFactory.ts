/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Argument } from '../Argument.ts';

export abstract class ArgumentFactory {
    static fromArg(arg: string): Argument {
        return new Argument(arg);
    }
}
