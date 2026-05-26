/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CookieContract } from './Value/Contract/CookieContract.js';
import { Header } from './Header.js';
import { HeaderName } from '../Constant/HeaderName.js';

export class SetCookie extends Header {
    constructor(...values: CookieContract[]) {
        super(HeaderName.SET_COOKIE, ...values);
    }
}
