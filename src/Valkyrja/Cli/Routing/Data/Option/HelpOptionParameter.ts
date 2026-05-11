import { OptionName } from '../../Constant/OptionName.js';
import { OptionShortName } from '../../Constant/OptionShortName.js';
import { OptionValueMode } from '../../Enum/OptionValueMode.js';
import { OptionParameter } from '../OptionParameter.js';

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
