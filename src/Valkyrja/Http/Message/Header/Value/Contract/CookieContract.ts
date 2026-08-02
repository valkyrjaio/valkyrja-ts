/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { SameSite } from '../../../Enum/SameSite.ts';
import type { ValueContract } from './ValueContract.ts';

export interface CookieContract extends ValueContract {
    delete(): this;
    getMaxAge(): number;
    getName(): string;
    withName(name: string): this;
    getValue(): string;
    withValue(value: string): this;
    getExpire(): number;
    withExpire(expire: number): this;
    getPath(): string;
    withPath(path: string): this;
    getDomain(): string;
    withDomain(domain: string): this;
    isSecure(): boolean;
    withSecure(secure: boolean): this;
    isHttpOnly(): boolean;
    withHttpOnly(httpOnly: boolean): this;
    isRaw(): boolean;
    withRaw(raw: boolean): this;
    getSameSite(): SameSite;
    withSameSite(sameSite: SameSite): this;
    toString(): string;
}
