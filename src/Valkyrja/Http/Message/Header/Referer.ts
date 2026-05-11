import type { ValueContract } from './Value/Contract/ValueContract.js';
import { Header } from './Header.js';
import { HeaderName } from '../Constant/HeaderName.js';

export class Referer extends Header {
    constructor(...values: Array<ValueContract | string>) {
        super(HeaderName.REFERER, ...values);
    }
}
