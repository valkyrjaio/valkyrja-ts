/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
