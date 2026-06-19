/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
