import { OptionName } from '../../Constant/OptionName.js';
import { OptionShortName } from '../../Constant/OptionShortName.js';
import { OptionValueMode } from '../../Enum/OptionValueMode.js';
import { OptionParameter } from '../OptionParameter.js';

export class VersionOptionParameter extends OptionParameter {
    constructor() {
        super(
            OptionName.VERSION,
            'Application version',
            '',
            null,
            '',
            [OptionShortName.VERSION],
            [],
            [],
            undefined,
            OptionValueMode.NONE,
        );
    }
}