/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { IncomingMessage } from 'node:http';
import { ServerRequest } from '../ServerRequest.ts';
import { JsonServerRequest } from '../JsonServerRequest.ts';
import { HeaderCollection } from '../../Header/Collection/HeaderCollection.ts';
import { Header } from '../../Header/Header.ts';
import { CookieParamCollection } from '../../Param/CookieParamCollection.ts';
import { QueryParamCollection } from '../../Param/QueryParamCollection.ts';
import { ServerParamCollection } from '../../Param/ServerParamCollection.ts';
import { ParsedBodyParamCollection } from '../../Param/ParsedBodyParamCollection.ts';
import { UploadedFileCollection } from '../../File/Collection/UploadedFileCollection.ts';
import { CookieFactory } from '../../Header/Factory/CookieFactory.ts';
import { ProtocolVersion } from '../../Enum/ProtocolVersion.ts';
import { RequestMethod } from '../../Enum/RequestMethod.ts';
import { Stream } from '../../Stream/Stream.ts';
import { UriFactory } from '../../Uri/Factory/UriFactory.ts';

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
            if (value == null) {
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
        const method = RequestMethod[(req.method ?? 'GET').toUpperCase() as keyof typeof RequestMethod];

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
