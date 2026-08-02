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
import { SilentOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/SilentOptionParameter.ts';
import { OptionValueMode } from '../../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';

describe('SilentOptionParameter', () => {
    it('exposes its name, short name, and a valueless mode', () => {
        const parameter = new SilentOptionParameter();

        expect(parameter.getName()).toBe(OptionName.SILENT);
        expect(parameter.getShortNames()).toStrictEqual([OptionShortName.SILENT]);
        expect(parameter.getValueMode()).toBe(OptionValueMode.NONE);
    });
});
