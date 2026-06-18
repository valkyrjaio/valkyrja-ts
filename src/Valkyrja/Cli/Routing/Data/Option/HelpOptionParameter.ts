/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { OptionName } from '../../Constant/OptionName.ts';
import { OptionShortName } from '../../Constant/OptionShortName.ts';
import { OptionValueMode } from '../../Enum/OptionValueMode.ts';
import { OptionParameter } from '../OptionParameter.ts';

export class HelpOptionParameter extends OptionParameter {
    constructor() {
        super(
            OptionName.HELP,
            'Help with this command',
            '',
            null,
            '',
            [OptionShortName.HELP],
            [],
            [],
            undefined,
            OptionValueMode.NONE,
        );
    }
}
