import type { IncomingMessage } from 'node:http';
import { ServerRequest } from '../ServerRequest.js';
import { JsonServerRequest } from '../JsonServerRequest.js';
import { HeaderCollection } from '../../Header/Collection/HeaderCollection.js';
import { Header } from '../../Header/Header.js';
import { CookieParamCollection } from '../../Param/CookieParamCollection.js';
import { QueryParamCollection } from '../../Param/QueryParamCollection.js';
import { ServerParamCollection } from '../../Param/ServerParamCollection.js';
import { ParsedBodyParamCollection } from '../../Param/ParsedBodyParamCollection.js';
import { UploadedFileCollection } from '../../File/Collection/UploadedFileCollection.js';
import { CookieFactory } from '../../Header/Factory/CookieFactory.js';
import { ProtocolVersion } from '../../Enum/ProtocolVersion.js';
import { RequestMethod } from '../../Enum/RequestMethod.js';
import { Stream } from '../../Stream/Stream.js';
import { UriFactory } from '../../Uri/Factory/UriFactory.js';

export abstract class RequestFactory {
    static fromNodeRequest(req: IncomingMessage): ServerRequest {
        return RequestFactory.buildFromNodeRequest(req, ServerRequest);
    }

    static jsonFromNodeRequest(req: IncomingMessage): JsonServerRequest {
        return RequestFactory.buildFromNodeRequest(req, JsonServerRequest) as JsonServerRequest;
    }

    protected static buildFromNodeRequest(req: IncomingMessage, RequestClass: typeof ServerRequest): ServerRequest {
        const rawHeaders = req.headers;
        const headers: Header[] = [];

        for (const [name, value] of Object.entries(rawHeaders)) {
            if (value === undefined) {
                continue;
            }
            const headerValue = Array.isArray(value) ? value.join(', ') : value;
            headers.push(new Header(name, headerValue));
        }

        const headerCollection = new HeaderCollection(...headers);

        const host = rawHeaders.host ?? 'localhost';
        const scheme = (req.socket as { encrypted?: boolean }).encrypted ? 'https' : 'http';
        const rawUrl = req.url ?? '/';
        const uri = UriFactory.fromString(`${scheme}://${host}${rawUrl}`);

        const cookieHeader = rawHeaders.cookie ?? '';
        const cookies = cookieHeader ? CookieFactory.parseCookieHeader(cookieHeader) : {};
        const searchParams = new URL(`${scheme}://${host}${rawUrl}`).searchParams;
        const query: Record<string, string | string[]> = {};

        for (const [key, value] of searchParams.entries()) {
            const existing = query[key];
            if (existing === undefined) {
                query[key] = value;
            } else if (Array.isArray(existing)) {
                existing.push(value);
            } else {
                query[key] = [existing, value];
            }
        }

        const serverParams: Record<string, string | string[]> = {
            method: req.method ?? 'GET',
            httpVersion: req.httpVersion,
        };

        const protocol = RequestFactory.getProtocolVersion(req.httpVersion);
        const method =
            RequestMethod[(req.method ?? 'GET').toUpperCase() as keyof typeof RequestMethod] ?? RequestMethod.GET;

        return new RequestClass(
            uri,
            method,
            new Stream(),
            headerCollection,
            protocol,
            new ServerParamCollection(serverParams),
            new CookieParamCollection(cookies),
            new QueryParamCollection(query),
            new ParsedBodyParamCollection(),
            new UploadedFileCollection(),
        );
    }

    protected static getProtocolVersion(httpVersion: string): ProtocolVersion {
        switch (httpVersion) {
            case '1.0':
                return ProtocolVersion.V1;
            case '2':
            case '2.0':
                return ProtocolVersion.V2;
            case '3':
            case '3.0':
                return ProtocolVersion.V3;
            default:
                return ProtocolVersion.V1_1;
        }
    }
}
