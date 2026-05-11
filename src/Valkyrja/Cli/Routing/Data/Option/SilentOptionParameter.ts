import { OptionName } from '../../Constant/OptionName.js';
import { OptionShortName } from '../../Constant/OptionShortName.js';
import { OptionValueMode } from '../../Enum/OptionValueMode.js';
import { OptionParameter } from '../OptionParameter.js';

export class SilentOptionParameter extends OptionParameter {
    constructor() {
        super(
            OptionName.SILENT,
            'All output is suppressed',
            '',
            null,
            '',
            [OptionShortName.SILENT],
            [],
            [],
            undefined,
            OptionValueMode.NONE,
        );
    }
}
