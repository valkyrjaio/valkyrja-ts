/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BackgroundColor } from '../Enum/BackgroundColor.ts';
import { TextColor } from '../Enum/TextColor.ts';
import { BackgroundColorFormat } from '../Format/BackgroundColorFormat.ts';
import { TextColorFormat } from '../Format/TextColorFormat.ts';
import { Formatter } from './Formatter.ts';

export class WarningFormatter extends Formatter {
    constructor() {
        super(new TextColorFormat(TextColor.BLACK), new BackgroundColorFormat(BackgroundColor.YELLOW));
    }
}
