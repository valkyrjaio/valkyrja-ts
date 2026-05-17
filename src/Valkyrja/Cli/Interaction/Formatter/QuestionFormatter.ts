import { TextColor } from '../Enum/TextColor.js';
import { TextColorFormat } from '../Format/TextColorFormat.js';
import { Formatter } from './Formatter.js';

export class QuestionFormatter extends Formatter {
    constructor() {
        super(new TextColorFormat(TextColor.MAGENTA));
    }
}
