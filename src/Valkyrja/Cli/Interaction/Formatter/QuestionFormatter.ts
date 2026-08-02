/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TextColor } from '../Enum/TextColor.ts';
import { TextColorFormat } from '../Format/TextColorFormat.ts';
import { Formatter } from './Formatter.ts';

export class QuestionFormatter extends Formatter {
    constructor() {
        super(new TextColorFormat(TextColor.MAGENTA));
    }
}
