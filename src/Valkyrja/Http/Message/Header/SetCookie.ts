import type { CookieContract } from './Value/Contract/CookieContract.js';
import { Header } from './Header.js';
import { HeaderName } from '../Constant/HeaderName.js';

export class SetCookie extends Header {
    constructor(...values: CookieContract[]) {
        super(HeaderName.SET_COOKIE, ...values);
    }
}