/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Rule } from '../Abstract/Rule.ts';

export class Equal extends Rule {
    constructor(
        subject: unknown,
        protected readonly value: unknown,
        errorMessage: string,
    ) {
        super(subject, errorMessage);
    }

    isValid(): boolean {
        return this.subject === this.value;
    }
}
