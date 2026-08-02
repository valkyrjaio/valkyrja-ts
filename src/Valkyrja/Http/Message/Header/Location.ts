/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ValueContract } from './Value/Contract/ValueContract.ts';
import { Header } from './Header.ts';
import { HeaderName } from '../Constant/HeaderName.ts';

export class Location extends Header {
    constructor(...values: Array<ValueContract | string>) {
        super(HeaderName.LOCATION, ...values);
    }
}
