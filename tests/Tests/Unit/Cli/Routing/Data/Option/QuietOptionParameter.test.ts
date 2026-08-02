/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { OptionName } from '../../../../../../../src/Valkyrja/Cli/Routing/Constant/OptionName.ts';
import { OptionShortName } from '../../../../../../../src/Valkyrja/Cli/Routing/Constant/OptionShortName.ts';
import { QuietOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/QuietOptionParameter.ts';
import { OptionValueMode } from '../../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';

describe('QuietOptionParameter', () => {
    it('exposes its name, short name, and a valueless mode', () => {
        const parameter = new QuietOptionParameter();

        expect(parameter.getName()).toBe(OptionName.QUIET);
        expect(parameter.getShortNames()).toStrictEqual([OptionShortName.QUIET]);
        expect(parameter.getValueMode()).toBe(OptionValueMode.NONE);
    });
});
