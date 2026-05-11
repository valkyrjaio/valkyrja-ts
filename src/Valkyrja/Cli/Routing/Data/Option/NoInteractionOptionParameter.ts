import { OptionName } from '../../Constant/OptionName.js';
import { OptionShortName } from '../../Constant/OptionShortName.js';
import { OptionValueMode } from '../../Enum/OptionValueMode.js';
import { OptionParameter } from '../OptionParameter.js';

export class NoInteractionOptionParameter extends OptionParameter {
    constructor() {
        super(
            OptionName.NO_INTERACTION,
            'No interactive questions are asked.',
            '',
            null,
            '',
            [OptionShortName.NO_INTERACTION],
            [],
            [],
            undefined,
            OptionValueMode.NONE,
        );
    }
}
