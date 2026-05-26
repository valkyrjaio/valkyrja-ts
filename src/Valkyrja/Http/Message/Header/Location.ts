/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ValueContract } from './Value/Contract/ValueContract.js';
import { Header } from './Header.js';
import { HeaderName } from '../Constant/HeaderName.js';

export class Location extends Header {
    constructor(...values: Array<ValueContract | string>) {
        super(HeaderName.LOCATION, ...values);
    }
}
