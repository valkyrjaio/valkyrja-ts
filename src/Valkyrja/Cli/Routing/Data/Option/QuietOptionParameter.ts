/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { OptionName } from '../../Constant/OptionName.ts';
import { OptionShortName } from '../../Constant/OptionShortName.ts';
import { OptionValueMode } from '../../Enum/OptionValueMode.ts';
import { OptionParameter } from '../OptionParameter.ts';

export class QuietOptionParameter extends OptionParameter {
    constructor() {
        super(
            OptionName.QUIET,
            'Output is suppressed, except for errors.',
            '',
            null,
            '',
            [OptionShortName.QUIET],
            [],
            [],
            undefined,
            OptionValueMode.NONE,
        );
    }
}
