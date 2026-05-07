import { Style } from '../Enum/Style.js';
import { Format } from './Format.js';

export class StyleFormat extends Format {
    constructor(style: Style) {
        super(
            String(style),
            String(Style.getDefault(style)),
        );
    }
}