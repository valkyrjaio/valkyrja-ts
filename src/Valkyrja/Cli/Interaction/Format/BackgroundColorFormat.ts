/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BackgroundColor } from '../Enum/BackgroundColor.js';
import { Format } from './Format.js';

export class BackgroundColorFormat extends Format {
    constructor(backgroundColor: BackgroundColor) {
        super(String(backgroundColor), String(BackgroundColor.getDefault()));
    }
}
