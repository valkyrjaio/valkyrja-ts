import type { UriContract } from '../Contract/UriContract.js';
import { Scheme } from '../Enum/Scheme.js';
import { UriPort } from '../Enum/Port.js';
import { Port } from '../../Constant/Port.js';
import { HttpUriInvalidFromStringException } from '../Throwable/Exception/HttpUriInvalidFromStringException.js';
import { HttpUriInvalidPathException } from '../Throwable/Exception/HttpUriInvalidPathException.js';
import { HttpUriInvalidPortException } from '../Throwable/Exception/HttpUriInvalidPortException.js';
import { HttpUriInvalidQueryException } from '../Throwable/Exception/HttpUriInvalidQueryException.js';
import { Uri } from '../Uri.js';

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
        const scheme   = UriFactory.filterScheme(uri.startsWith('//') ? '' : (parsed.protocol.replace(/:$/, '') || ''));
        const username = parsed.username;
        const password = parsed.password;
        const host     = parsed.hostname;
        const port     = parsed.port !== '' ? parseInt(parsed.port, 10) : 0;
        const path     = parsed.pathname === '/' && !uri.includes('/') ? '' : parsed.pathname;
        const query    = parsed.search.replace(/^\?/, '');
        const fragment = parsed.hash.replace(/^#/, '');

        return new Uri(scheme, username, password, host, port, path, query, fragment);
    }

    static toString(uri: UriContract): string {
        return UriFactory.getSchemeStringPart(uri)
            + UriFactory.getAuthorityStringPart(uri)
            + UriFactory.getPathStringPart(uri)
            + UriFactory.getQueryStringPart(uri)
            + UriFactory.getFragmentStringPart(uri);
    }

    static filterScheme(scheme: string): Scheme {
        scheme = scheme.toLowerCase().replace(/:(\/\/)?$/, '');
        return (Object.values(Scheme) as string[]).includes(scheme)
            ? (scheme as Scheme)
            : Scheme.EMPTY;
    }

    static validatePort(port: number): void {
        if (!Port.isValid(port)) {
            throw new HttpUriInvalidPortException(`Invalid port \`${port}\` specified; must be a valid TCP/UDP port`);
        }
    }

    static filterUserInfo(userInfo: string): string {
        return userInfo;
    }

    static filterPath(path: string): string {
        UriFactory.validatePath(path);
        if (path.startsWith('/')) {
            return '/' + path.replace(/^\/+/, '');
        }
        return path;
    }

    static validatePath(path: string): void {
        if (path.includes('?')) {
            throw new HttpUriInvalidPathException(`Invalid path of \`${path}\` provided; must not contain a query string`);
        }
        if (path.includes('#')) {
            throw new HttpUriInvalidPathException(`Invalid path of \`${path}\` provided; must not contain a URI fragment`);
        }
    }

    static filterQuery(query: string): string {
        UriFactory.validateQuery(query);
        return query.replace(/^\?/, '');
    }

    static validateQuery(query: string): void {
        if (query.includes('#')) {
            throw new HttpUriInvalidQueryException(`Invalid query string of \`${query}\` provided; must not contain a URI fragment`);
        }
    }

    static filterFragment(fragment: string): string {
        return fragment.replace(/^#/, '');
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
        return scheme === Scheme.HTTP && port === UriPort.HTTP;
    }

    static isStandardSecurePort(scheme: Scheme, port: number): boolean {
        return scheme === Scheme.HTTPS && port === UriPort.HTTPS;
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
}