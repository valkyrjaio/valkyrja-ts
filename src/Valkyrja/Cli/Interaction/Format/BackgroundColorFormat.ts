/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BackgroundColor, backgroundColorDefault } from '../Enum/BackgroundColor.ts';
import { Format } from './Format.ts';

export class BackgroundColorFormat extends Format {
    constructor(backgroundColor: BackgroundColor) {
        super(String(backgroundColor), String(backgroundColorDefault()));
    }
}
