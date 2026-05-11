import type { CookieContract } from './Contract/CookieContract.js';
import { SameSite } from '../../Enum/SameSite.js';
import { Component } from './Component/Component.js';
import { Value } from './Value.js';

export class Cookie extends Value implements CookieContract {
    constructor(
        protected name: string,
        protected value: string     = '',
        protected expire: number    = 0,
        protected path: string      = '/',
        protected domain: string    = '',
        protected secure: boolean   = false,
        protected httpOnly: boolean = true,
        protected raw: boolean      = false,
        protected sameSite: SameSite = SameSite.LAX,
        protected deleted: boolean  = false,
    ) {
        super();
    }

    delete(): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.deleted  = true;
        return clone;
    }

    getMaxAge(): number {
        return this.expire > 0 ? this.expire - Math.floor(Date.now() / 1000) : 0;
    }

    getName(): string { return this.name; }

    withName(name: string): this {
        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.name  = name;
        return clone;
    }

    getValue(): string { return this.value; }

    withValue(value: string): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.value  = value;
        return clone;
    }

    getExpire(): number { return this.expire; }

    withExpire(expire: number): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.expire  = expire;
        return clone;
    }

    getPath(): string { return this.path; }

    withPath(path: string): this {
        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.path  = path;
        return clone;
    }

    getDomain(): string { return this.domain; }

    withDomain(domain: string): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.domain  = domain;
        return clone;
    }

    isSecure(): boolean { return this.secure; }

    withSecure(secure: boolean): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.secure  = secure;
        return clone;
    }

    isHttpOnly(): boolean { return this.httpOnly; }

    withHttpOnly(httpOnly: boolean): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.httpOnly   = httpOnly;
        return clone;
    }

    isRaw(): boolean { return this.raw; }

    withRaw(raw: boolean): this {
        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.raw   = raw;
        return clone;
    }

    getSameSite(): SameSite { return this.sameSite; }

    withSameSite(sameSite: SameSite): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.sameSite   = sameSite;
        return clone;
    }

    override toString(): string {
        let value   = this.value;
        let expire  = this.expire;
        let maxAge  = this.getMaxAge();

        if (this.deleted) {
            const pastTime = Math.floor(Date.now() / 1000) - 31536001;
            expire         = pastTime;
            maxAge         = -31536001;
            value          = 'delete';
        }

        const parts: string[] = [
            `${encodeURIComponent(this.name)}=${encodeURIComponent(value)}`,
        ];

        if (expire !== 0) {
            parts.push(`expires=${new Date(expire * 1000).toUTCString()}`);
            parts.push(`max-age=${String(maxAge)}`);
        }

        parts.push(`path=${this.path}`);

        if (this.domain !== '') {
            parts.push(`domain=${this.domain}`);
        }
        if (this.secure) {
            parts.push('secure');
        }
        if (this.httpOnly) {
            parts.push('httponly');
        }
        parts.push(`samesite=${this.sameSite}`);

        return parts.join('; ');
    }
}