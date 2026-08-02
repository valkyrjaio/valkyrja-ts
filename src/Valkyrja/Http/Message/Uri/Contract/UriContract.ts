/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { Scheme } from '../Enum/Scheme.ts';

export interface UriContract {
    getScheme(): Scheme;
    isSecure(): boolean;
    getAuthority(): string;
    getUsername(): string;
    getPassword(): string;
    getUserInfo(): string;
    getHost(): string;
    hasPort(): boolean;
    getPort(): number;
    getHostPort(): string;
    getSchemeHostPort(): string;
    getPath(): string;
    getQuery(): string;
    getFragment(): string;
    withScheme(scheme: Scheme): this;
    withUsername(username: string): this;
    withPassword(password: string): this;
    withUserInfo(user: string, password?: string): this;
    withHost(host: string): this;
    withPort(port: number): this;
    withPath(path: string): this;
    withQuery(query: string): this;
    withFragment(fragment: string): this;
    toString(): string;
}
