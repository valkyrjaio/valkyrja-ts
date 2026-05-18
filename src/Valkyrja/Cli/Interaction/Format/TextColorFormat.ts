import { TextColor } from '../Enum/TextColor.js';
import { Format } from './Format.js';

export class TextColorFormat extends Format {
    constructor(textColor: TextColor) {
        super(String(textColor), String(TextColor.getDefault()));
    }
}
