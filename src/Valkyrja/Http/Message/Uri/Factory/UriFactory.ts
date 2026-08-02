/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { UriContract } from '../Contract/UriContract.ts';
import { Char } from '../Constant/Char.ts';
import { Scheme } from '../Enum/Scheme.ts';
import { Port } from '../../Constant/Port.ts';
import { HttpUriInvalidFromStringException } from '../Throwable/Exception/HttpUriInvalidFromStringException.ts';
import { HttpUriInvalidPathException } from '../Throwable/Exception/HttpUriInvalidPathException.ts';
import { HttpUriInvalidPortException } from '../Throwable/Exception/HttpUriInvalidPortException.ts';
import { HttpUriInvalidQueryException } from '../Throwable/Exception/HttpUriInvalidQueryException.ts';
import { Uri } from '../Uri.ts';

export abstract class UriFactory {
    static fromString(uri: string): UriContract {
        if (uri !== '' && !uri.startsWith('/') && !uri.startsWith(Scheme.HTTP) && !uri.startsWith(Scheme.HTTPS)) {
            uri = '//' + uri;
        }
        let parsed: URL;
        try {
            parsed = new URL(uri, 'http://placeholder');
        } catch {
            throw new HttpUriInvalidFromStringException(`Invalid uri \`${uri}\` provided`);
        }
        const scheme = UriFactory.filterScheme(uri.startsWith('//') ? '' : parsed.protocol.replace(/:$/, ''));
        const username = parsed.username;
        const password = parsed.password;
        const host = parsed.hostname;
        const port = parsed.port !== '' ? parseInt(parsed.port, 10) : 0;
        const path = parsed.pathname === '/' && !uri.includes('/') ? '' : parsed.pathname;
        const query = parsed.search.replace(/^\?/, '');
        const fragment = parsed.hash.replace(/^#/, '');

        return new Uri(scheme, username, password, host, port, path, query, fragment);
    }

    static toString(uri: UriContract): string {
        return (
            UriFactory.getSchemeStringPart(uri) +
            UriFactory.getAuthorityStringPart(uri) +
            UriFactory.getPathStringPart(uri) +
            UriFactory.getQueryStringPart(uri) +
            UriFactory.getFragmentStringPart(uri)
        );
    }

    static filterScheme(scheme: string): Scheme {
        scheme = scheme.toLowerCase().replace(/:(\/\/)?$/, '');
        return (Object.values(Scheme) as string[]).includes(scheme) ? (scheme as Scheme) : Scheme.EMPTY;
    }

    static validatePort(port: number): void {
        if (!Port.isValid(port)) {
            throw new HttpUriInvalidPortException(
                `Invalid port \`${String(port)}\` specified; must be a valid TCP/UDP port`,
            );
        }
    }

    /**
     * The user info allows the unreserved characters, the sub-delimiters, and a colon. The colon
     * separates the username from the password, and a password can contain one.
     *
     * @see https://tools.ietf.org/html/rfc3986#section-3.2.1
     */
    static filterUserInfo(userInfo: string): string {
        return UriFactory.encode(userInfo, Char.USER_INFO);
    }

    /**
     * A host is either an IP literal or a reg-name. An IP literal is in brackets and holds
     * characters that a reg-name does not allow, so this method does not encode one.
     *
     * @see https://tools.ietf.org/html/rfc3986#section-3.2.2
     */
    static filterHost(host: string): string {
        host = host.toLowerCase();
        if (host.startsWith('[') && host.endsWith(']')) {
            return host;
        }
        return UriFactory.encode(host, Char.HOST);
    }

    /**
     * The path allows the unreserved characters, the sub-delimiters, a colon, an at sign, and a
     * forward slash.
     *
     * @see https://tools.ietf.org/html/rfc3986#section-3.3
     */
    static filterPath(path: string): string {
        UriFactory.validatePath(path);
        path = UriFactory.encode(path, Char.PATH);
        if (path.startsWith('/')) {
            return '/' + path.replace(/^\/+/, '');
        }
        return path;
    }

    static validatePath(path: string): void {
        if (path.includes('?')) {
            throw new HttpUriInvalidPathException(
                `Invalid path of \`${path}\` provided; must not contain a query string`,
            );
        }
        if (path.includes('#')) {
            throw new HttpUriInvalidPathException(
                `Invalid path of \`${path}\` provided; must not contain a URI fragment`,
            );
        }
    }

    /**
     * The query allows the unreserved characters, the sub-delimiters, a colon, an at sign, a
     * forward slash, and a question mark.
     *
     * @see https://tools.ietf.org/html/rfc3986#section-3.4
     */
    static filterQuery(query: string): string {
        UriFactory.validateQuery(query);
        return UriFactory.encode(query.replace(/^\?+/, ''), Char.QUERY);
    }

    static validateQuery(query: string): void {
        if (query.includes('#')) {
            throw new HttpUriInvalidQueryException(
                `Invalid query string of \`${query}\` provided; must not contain a URI fragment`,
            );
        }
    }

    /**
     * The fragment allows the same characters as the query.
     *
     * @see https://tools.ietf.org/html/rfc3986#section-3.5
     */
    static filterFragment(fragment: string): string {
        return UriFactory.encode(fragment.replace(/^#+/, ''), Char.QUERY);
    }

    static isStandardPort(scheme: Scheme, host: string, port: number): boolean {
        if (scheme === Scheme.EMPTY) {
            return host !== '' && port <= 0;
        }
        if (host === '' || port <= 0) {
            return true;
        }
        return UriFactory.isStandardUnsecurePort(scheme, port) || UriFactory.isStandardSecurePort(scheme, port);
    }

    static isStandardUnsecurePort(scheme: Scheme, port: number): boolean {
        return scheme === Scheme.HTTP && port === Port.HTTP;
    }

    static isStandardSecurePort(scheme: Scheme, port: number): boolean {
        return scheme === Scheme.HTTPS && port === Port.HTTPS;
    }

    static getSchemeStringPart(uri: UriContract): string {
        const scheme = uri.getScheme();
        return scheme !== Scheme.EMPTY ? scheme + ':' : '';
    }

    static getAuthorityStringPart(uri: UriContract): string {
        const authority = uri.getAuthority();
        return authority !== '' ? '//' + authority : '';
    }

    static getPathStringPart(uri: UriContract): string {
        const path = uri.getPath();
        if (path !== '') {
            return path.startsWith('/') ? path : '/' + path;
        }
        return '';
    }

    static getQueryStringPart(uri: UriContract): string {
        const query = uri.getQuery();
        return query !== '' ? '?' + query : '';
    }

    static getFragmentStringPart(uri: UriContract): string {
        const fragment = uri.getFragment();
        return fragment !== '' ? '#' + fragment : '';
    }

    /**
     * Percent-encode the characters that a uri component does not allow unencoded.
     *
     * A character that is already part of a valid percent-encoded triplet is not encoded a second
     * time; the triplet keeps its meaning and its hexadecimal digits become uppercase. A percent
     * sign that does not begin a valid triplet is a literal percent sign, so this method encodes
     * it.
     *
     * @see https://tools.ietf.org/html/rfc3986#section-2.1
     *
     * @param value The component value
     * @param allowed The character class atoms the component allows, from Char
     */
    protected static encode(value: string, allowed: string): string {
        const pattern = new RegExp('(%[A-Fa-f0-9]{2})|[^' + allowed + ']+', 'g');

        return value.replace(pattern, (match: string, triplet: string | undefined): string =>
            triplet !== undefined ? triplet.toUpperCase() : encodeURIComponent(match),
        );
    }
}
