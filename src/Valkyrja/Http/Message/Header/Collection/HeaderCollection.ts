import type { HeaderCollectionContract } from './Contract/HeaderCollectionContract.js';
import type { HeaderContract } from '../Contract/HeaderContract.js';
import { HttpHeaderInvalidHeaderNameException } from '../Throwable/Exception/HttpHeaderInvalidHeaderNameException.js';
import { HttpHeaderInvalidHeaderParamException } from '../Throwable/Exception/HttpHeaderInvalidHeaderParamException.js';

export class HeaderCollection implements HeaderCollectionContract {
    protected headers: Record<string, HeaderContract> = {};

    constructor(...headers: HeaderContract[]) {
        this.setHeaders(...headers);
    }

    static fromArray(data: Record<string, unknown>): HeaderCollection {
        const headers: HeaderContract[] = [];
        for (const param of Object.values(data)) {
            HeaderCollection.validateHeader(param);
            headers.push(param);
        }
        return new HeaderCollection(...headers);
    }

    protected static validateHeader(param: unknown): asserts param is HeaderContract {
        if (param === null || typeof param !== 'object' || !('getName' in param)) {
            throw new HttpHeaderInvalidHeaderParamException('Param must be header');
        }
    }

    has(name: string): boolean {
        return name.toLowerCase() in this.headers;
    }

    get(name: string): HeaderContract {
        const header = this.headers[name.toLowerCase()];
        if (header === undefined) {
            throw new HttpHeaderInvalidHeaderNameException(`Header ${name} does not exist`);
        }
        return header;
    }

    getHeaderLine(name: string): string {
        return this.has(name) ? this.get(name).getHeaderLine() : '';
    }

    getAll(): Record<string, HeaderContract> {
        return { ...this.headers };
    }

    getOnly(...names: string[]): Record<string, HeaderContract> {
        const lower   = names.map((n) => n.toLowerCase());
        const result: Record<string, HeaderContract> = {};
        for (const [k, v] of Object.entries(this.headers)) {
            if (lower.includes(k)) {
                result[k] = v;
            }
        }
        return result;
    }

    getAllExcept(...names: string[]): Record<string, HeaderContract> {
        const lower   = names.map((n) => n.toLowerCase());
        const result: Record<string, HeaderContract> = {};
        for (const [k, v] of Object.entries(this.headers)) {
            if (!lower.includes(k)) {
                result[k] = v;
            }
        }
        return result;
    }

    withHeader(header: HeaderContract): this {
        const clone                                 = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.headers                               = { ...this.headers };
        clone.headers[header.getNormalizedName()]   = header;
        return clone;
    }

    withoutHeader(name: string): this {
        const clone    = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.headers  = { ...this.headers };
        delete clone.headers[name.toLowerCase()];
        return clone;
    }

    withHeaders(...headers: HeaderContract[]): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.headers = {};
        this.setHeadersOnCollection(clone, ...headers);
        return clone;
    }

    withAddedHeaders(...headers: HeaderContract[]): this {
        const clone   = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.headers = { ...this.headers };
        this.setHeadersOnCollection(clone, ...headers);
        return clone;
    }

    protected setHeaders(...headers: HeaderContract[]): void {
        this.setHeadersOnCollection(this, ...headers);
    }

    protected setHeadersOnCollection(collection: this, ...headers: HeaderContract[]): void {
        for (const header of headers) {
            collection.headers[header.getNormalizedName()] = header;
        }
    }
}
