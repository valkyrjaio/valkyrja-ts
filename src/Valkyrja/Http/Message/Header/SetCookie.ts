/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CookieContract } from './Value/Contract/CookieContract.ts';
import { Header } from './Header.ts';
import { HeaderName } from '../Constant/HeaderName.ts';

export class SetCookie extends Header {
    constructor(...values: CookieContract[]) {
        super(HeaderName.SET_COOKIE, ...values);
    }
}
