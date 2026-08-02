/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class Cast {
    constructor(
        public readonly type: string,
        public readonly convert: boolean = true,
        public readonly isArray: boolean = false,
    ) {}
}
