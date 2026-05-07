import { BackgroundColor } from '../Enum/BackgroundColor.js';
import { TextColor } from '../Enum/TextColor.js';
import { BackgroundColorFormat } from '../Format/BackgroundColorFormat.js';
import { TextColorFormat } from '../Format/TextColorFormat.js';
import { Formatter } from './Formatter.js';

export class SuccessFormatter extends Formatter {
    constructor() {
        super(
            new TextColorFormat(TextColor.LIGHT_WHITE),
            new BackgroundColorFormat(BackgroundColor.GREEN),
        );
    }
}