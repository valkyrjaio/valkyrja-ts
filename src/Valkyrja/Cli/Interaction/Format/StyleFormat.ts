/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Style, styleDefault } from '../Enum/Style.ts';
import { Format } from './Format.ts';

export class StyleFormat extends Format {
    constructor(style: Style) {
        super(String(style), String(styleDefault(style)));
    }
}
