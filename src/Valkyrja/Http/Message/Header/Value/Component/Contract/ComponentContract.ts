/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export interface ComponentContract {
    getToken(): string;
    withToken(token: string): this;
    getText(): string;
    withText(text: string): this;
    toString(): string;
}
