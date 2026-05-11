import { BackgroundColor } from '../Enum/BackgroundColor.js';
import { Format } from './Format.js';

export class BackgroundColorFormat extends Format {
    constructor(backgroundColor: BackgroundColor) {
        super(
            String(backgroundColor),
            String(BackgroundColor.getDefault()),
        );
    }
}
