/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TextColor, textColorDefault } from '../Enum/TextColor.ts';
import { Format } from './Format.ts';

export class TextColorFormat extends Format {
    constructor(textColor: TextColor) {
        super(String(textColor), String(textColorDefault()));
    }
}
