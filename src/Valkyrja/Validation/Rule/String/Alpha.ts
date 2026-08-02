/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Rule } from '../Abstract/Rule.ts';

export class Alpha extends Rule {
    isValid(): boolean {
        return typeof this.subject === 'string' && /^[a-zA-Z]+$/.test(this.subject);
    }
}
