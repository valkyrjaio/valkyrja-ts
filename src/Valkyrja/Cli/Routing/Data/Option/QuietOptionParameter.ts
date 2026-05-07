import { OptionName } from '../../Constant/OptionName.js';
import { OptionShortName } from '../../Constant/OptionShortName.js';
import { OptionValueMode } from '../../Enum/OptionValueMode.js';
import { OptionParameter } from '../OptionParameter.js';

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