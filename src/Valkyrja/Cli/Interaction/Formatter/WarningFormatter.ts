/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BackgroundColor } from '../Enum/BackgroundColor.js';
import { TextColor } from '../Enum/TextColor.js';
import { BackgroundColorFormat } from '../Format/BackgroundColorFormat.js';
import { TextColorFormat } from '../Format/TextColorFormat.js';
import { Formatter } from './Formatter.js';

export class WarningFormatter extends Formatter {
    constructor() {
        super(new TextColorFormat(TextColor.BLACK), new BackgroundColorFormat(BackgroundColor.YELLOW));
    }
}
