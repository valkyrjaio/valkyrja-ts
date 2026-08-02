/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { CookieContract } from './Value/Contract/CookieContract.ts';
import { Header } from './Header.ts';
import { HeaderName } from '../Constant/HeaderName.ts';

export class SetCookie extends Header {
    constructor(...values: CookieContract[]) {
        super(HeaderName.SET_COOKIE, ...values);
    }
}
