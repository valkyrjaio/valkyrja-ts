import { BackgroundColor } from '../Enum/BackgroundColor.js';
import { TextColor } from '../Enum/TextColor.js';
import { BackgroundColorFormat } from '../Format/BackgroundColorFormat.js';
import { TextColorFormat } from '../Format/TextColorFormat.js';
import { Formatter } from './Formatter.js';

export class WarningFormatter extends Formatter {
    constructor() {
        super(
            new TextColorFormat(TextColor.BLACK),
            new BackgroundColorFormat(BackgroundColor.YELLOW),
        );
    }
}
