import type { UriContract } from './Contract/UriContract.js';
import { Scheme } from './Enum/Scheme.js';
import { UriFactory } from './Factory/UriFactory.js';

export class Uri implements UriContract {
    protected userInfo: string;
    protected uriString: string | null = null;

    constructor(
        protected scheme: Scheme   = Scheme.EMPTY,
        protected username: string = '',
        protected password: string = '',
        protected host: string     = '',
        protected port: number     = 0,
        protected path: string     = '',
        protected query: string    = '',
        protected fragment: string = '',
    ) {
        let userInfo = username;
        if (password !== '') {
            userInfo += ':' + password;
        }
        if (port === 0) {
            port = this.getPortFromScheme(scheme);
        } else {
            UriFactory.validatePort(port);
        }
        this.port      = port;
        this.userInfo  = UriFactory.filterUserInfo(userInfo);
        this.host      = host.toLowerCase();
        this.path      = UriFactory.filterPath(path);
        this.query     = UriFactory.filterQuery(query);
        this.fragment  = UriFactory.filterFragment(fragment);
    }

    getScheme(): Scheme { return this.scheme; }

    isSecure(): boolean { return this.scheme === Scheme.HTTPS; }

    getAuthority(): string {
        if (this.host === '') {
            return '';
        }
        let authority = this.host;
        if (this.userInfo !== '') {
            authority = this.userInfo + '@' + authority;
        }
        if (!UriFactory.isStandardPort(this.scheme, this.host, this.port)) {
            authority += ':' + String(this.port);
        }
        return authority;
    }

    getUsername(): string { return this.username; }
    getPassword(): string { return this.password; }
    getUserInfo(): string { return this.userInfo; }
    getHost(): string { return this.host; }
    hasPort(): boolean { return this.port !== 0; }

    getPort(): number {
        return UriFactory.isStandardPort(this.scheme, this.host, this.port) ? 0 : this.port;
    }

    getHostPort(): string {
        let host  = this.host;
        const port = this.getPort();
        if (host !== '' && port !== 0) {
            host += ':' + String(port);
        }
        return host;
    }

    getSchemeHostPort(): string {
        const hostPort = this.getHostPort();
        return hostPort !== '' && this.scheme !== Scheme.EMPTY
            ? this.scheme + '://' + hostPort
            : hostPort;
    }

    getPath(): string { return this.path; }
    getQuery(): string { return this.query; }
    getFragment(): string { return this.fragment; }

    withScheme(scheme: Scheme): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.scheme   = scheme;
        clone.uriString = null;
        if (this.port === 0) {
            clone.port = this.getPortFromScheme(scheme);
        }
        return clone;
    }

    withUsername(username: string): this {
        return this.withUserInfo(username, this.password);
    }

    withPassword(password: string): this {
        return this.withUserInfo(this.username, password);
    }

    withUserInfo(user: string, password: string = ''): this {
        let info = user;
        if (user === '') {
            password = '';
        }
        if (password !== '') {
            info += ':' + password;
        }
        const clone       = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.userInfo    = info;
        clone.username    = user;
        clone.password    = password;
        clone.uriString   = null;
        return clone;
    }

    withHost(host: string): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.host     = host;
        clone.uriString = null;
        return clone;
    }

    withPort(port: number): this {
        UriFactory.validatePort(port);
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.port     = port;
        clone.uriString = null;
        return clone;
    }

    withPath(path: string): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.path     = UriFactory.filterPath(path);
        clone.uriString = null;
        return clone;
    }

    withQuery(query: string): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.query    = UriFactory.filterQuery(query);
        clone.uriString = null;
        return clone;
    }

    withFragment(fragment: string): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.fragment   = UriFactory.filterFragment(fragment);
        clone.uriString  = null;
        return clone;
    }

    toString(): string {
        return (this.uriString ??= UriFactory.toString(this));
    }

    protected getPortFromScheme(scheme: Scheme): number {
        if (scheme === Scheme.HTTPS) return 443;
        if (scheme === Scheme.HTTP) return 80;
        return 0;
    }
}
