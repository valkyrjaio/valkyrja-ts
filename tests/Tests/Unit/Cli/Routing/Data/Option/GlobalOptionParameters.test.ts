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
import { HelpOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/HelpOptionParameter.ts';
import { NoInteractionOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/NoInteractionOptionParameter.ts';
import { QuietOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/QuietOptionParameter.ts';
import { SilentOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/SilentOptionParameter.ts';
import { VersionOptionParameter } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Option/VersionOptionParameter.ts';
import { OptionValueMode } from '../../../../../../../src/Valkyrja/Cli/Routing/Enum/OptionValueMode.ts';

describe('Global option parameters', () => {
    it.each([
        [new HelpOptionParameter(), OptionName.HELP, OptionShortName.HELP],
        [new VersionOptionParameter(), OptionName.VERSION, OptionShortName.VERSION],
        [new QuietOptionParameter(), OptionName.QUIET, OptionShortName.QUIET],
        [new SilentOptionParameter(), OptionName.SILENT, OptionShortName.SILENT],
        [new NoInteractionOptionParameter(), OptionName.NO_INTERACTION, OptionShortName.NO_INTERACTION],
    ])('exposes its name, short name, and a valueless mode', (parameter, name, shortName) => {
        expect(parameter.getName()).toBe(name);
        expect(parameter.getShortNames()).toStrictEqual([shortName]);
        expect(parameter.getValueMode()).toBe(OptionValueMode.NONE);
    });
});
