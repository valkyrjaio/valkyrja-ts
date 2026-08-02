/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { OptionName } from '../../../../../../../src/Valkyrja/Cli/Routing/Constant/OptionName.ts';
import { OptionShortName } from '../../../../../../../src/Valkyrja/Cli/Routing/Constant/OptionShortName.ts';
import { NoInteractionOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/NoInteractionOptionParameter.ts';
import { OptionValueMode } from '../../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';

describe('NoInteractionOptionParameter', () => {
    it('exposes its name, short name, and a valueless mode', () => {
        const parameter = new NoInteractionOptionParameter();

        expect(parameter.getName()).toBe(OptionName.NO_INTERACTION);
        expect(parameter.getShortNames()).toStrictEqual([OptionShortName.NO_INTERACTION]);
        expect(parameter.getValueMode()).toBe(OptionValueMode.NONE);
    });
});
