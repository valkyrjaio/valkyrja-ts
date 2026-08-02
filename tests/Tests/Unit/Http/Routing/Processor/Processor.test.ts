/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Regex } from '../../../../../../src/Valkyrja/Http/Routing/Constant/Regex.ts';
import { DynamicRoute } from '../../../../../../src/Valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Parameter } from '../../../../../../src/Valkyrja/Http/Routing/Data/Parameter.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { Processor } from '../../../../../../src/Valkyrja/Http/Routing/Processor/Processor.ts';
import { HttpRoutingInvalidRoutePathException } from '../../../../../../src/Valkyrja/Http/Routing/Throwable/Exception/HttpRoutingInvalidRoutePathException.ts';

import type { DynamicRouteContract } from '../../../../../../src/Valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';

const handler = (): ResponseContract => ({}) as unknown as ResponseContract;

function dynamic(path: string, regex: string, parameters: Parameter[]): DynamicRoute {
    return new DynamicRoute(path, 'route', regex, parameters, handler);
}

describe('Processor', () => {
    const processor = new Processor();

    it('normalizes the path of a static route without building a regex', () => {
        const route = processor.route(new Route('users/', 'users.index', handler));

        expect(route.getPath()).toBe('/users');
    });

    it('builds a named capture-group regex for a required parameter', () => {
        const route = processor.route(
            dynamic('/users/{id}', '', [new Parameter('id', Regex.NUM)]),
        ) as DynamicRouteContract;

        expect(route.getRegex()).toBe('^\\/users\\/(?<id>\\d+)$');
    });

    it('builds an optional, non-capturing group when configured', () => {
        const param = new Parameter('id', Regex.NUM).withIsOptional(true).withShouldCapture(false);
        const route = processor.route(dynamic('/users/{id?}', '', [param])) as DynamicRouteContract;

        expect(route.getRegex()).toContain(Regex.START_OPTIONAL_CAPTURE_GROUP);
        expect(route.getRegex()).toContain(Regex.START_NON_CAPTURE_GROUP);
    });

    it('leaves a dynamic route untouched when it already has a regex', () => {
        const route = processor.route(
            dynamic('/users/{id}', '/existing', [new Parameter('id', Regex.NUM)]),
        ) as DynamicRouteContract;

        expect(route.getRegex()).toBe('/existing');
    });

    it('does not build a regex for a dynamic route without placeholders', () => {
        const route = processor.route(dynamic('/static', '', [])) as DynamicRouteContract;

        expect(route.getRegex()).toBe('');
    });

    it('throws when a parameter name is missing from the path', () => {
        expect(() => processor.route(dynamic('/users/{id}', '', [new Parameter('other', Regex.NUM)]))).toThrow(
            HttpRoutingInvalidRoutePathException,
        );
    });

    function processRegex(path: string, parameters: Parameter[]): string {
        return (processor.route(dynamic(path, '', parameters)) as DynamicRouteContract).getRegex();
    }

    const cap = (name: string, regex: string): Parameter => new Parameter(name, regex);
    const opt = (name: string, regex: string): Parameter => new Parameter(name, regex, null, true, true);
    const noncap = (name: string, regex: string): Parameter => new Parameter(name, regex, null, false, false);
    const optNoncap = (name: string, regex: string): Parameter => new Parameter(name, regex, null, true, false);

    it.each([
        ['num', Regex.NUM],
        ['id', Regex.ID],
        ['slug', Regex.SLUG],
        ['any', Regex.ANY],
        ['alpha', Regex.ALPHA],
        ['alphaLowercase', Regex.ALPHA_LOWERCASE],
        ['alphaUppercase', Regex.ALPHA_UPPERCASE],
        ['alphaNum', Regex.ALPHA_NUM],
        ['alphaNumUnderscore', Regex.ALPHA_NUM_UNDERSCORE],
        ['uuid', Regex.UUID],
        ['uuidV1', Regex.UUID_V1],
        ['uuidV3', Regex.UUID_V3],
        ['uuidV4', Regex.UUID_V4],
        ['uuidV5', Regex.UUID_V5],
        ['uuidV6', Regex.UUID_V6],
        ['uuidV7', Regex.UUID_V7],
        ['uuidV8', Regex.UUID_V8],
        ['ulid', Regex.ULID],
        ['vlid', Regex.VLID],
        ['vlidV1', Regex.VLID_V1],
        ['vlidV2', Regex.VLID_V2],
        ['vlidV3', Regex.VLID_V3],
        ['vlidV4', Regex.VLID_V4],
    ])('produces the exact regex for the %s parameter type', (_label, typeRegex) => {
        const regex = processRegex('/{value}', [new Parameter('value', typeRegex)]);

        expect(regex).toBe(`${Regex.START}${Regex.PATH}(?<value>${typeRegex})${Regex.END}`);
        expect(() => new RegExp(regex)).not.toThrow();
    });

    it.each([
        [
            'parameter at end',
            '/parameters/{name}',
            [cap('name', Regex.ALPHA)],
            `${Regex.START}${Regex.PATH}parameters${Regex.PATH}(?<name>${Regex.ALPHA})${Regex.END}`,
        ],
        [
            'parameter at start',
            '/{name}/edit',
            [cap('name', Regex.ALPHA)],
            `${Regex.START}${Regex.PATH}(?<name>${Regex.ALPHA})${Regex.PATH}edit${Regex.END}`,
        ],
        [
            'parameter in the middle',
            '/user/{id}/edit',
            [cap('id', Regex.NUM)],
            `${Regex.START}${Regex.PATH}user${Regex.PATH}(?<id>${Regex.NUM})${Regex.PATH}edit${Regex.END}`,
        ],
        [
            'multiple separated parameters',
            '/a/{x}/b/{y}',
            [cap('x', Regex.NUM), cap('y', Regex.ALPHA)],
            `${Regex.START}${Regex.PATH}a${Regex.PATH}(?<x>${Regex.NUM})${Regex.PATH}b${Regex.PATH}(?<y>${Regex.ALPHA})${Regex.END}`,
        ],
        [
            'adjacent parameters',
            '/{x}{y}',
            [cap('x', Regex.NUM), cap('y', Regex.ALPHA)],
            `${Regex.START}${Regex.PATH}(?<x>${Regex.NUM})(?<y>${Regex.ALPHA})${Regex.END}`,
        ],
    ])('produces the exact regex for %s', (_label, path, parameters, expected) => {
        expect(processRegex(path, parameters)).toBe(expected);
    });

    it.each([
        [
            'a single optional parameter',
            '/{opt?}',
            [opt('opt', Regex.ALPHA)],
            `${Regex.START}${Regex.START_OPTIONAL_CAPTURE_GROUP}(?<opt>${Regex.ALPHA})?${Regex.END}`,
        ],
        [
            'a non-capturing parameter',
            '/{nc}',
            [noncap('nc', Regex.ALPHA)],
            `${Regex.START}${Regex.PATH}(?:${Regex.ALPHA})${Regex.END}`,
        ],
        [
            'an optional non-capturing parameter',
            '/{onc?}',
            [optNoncap('onc', Regex.ALPHA)],
            `${Regex.START}${Regex.START_OPTIONAL_CAPTURE_GROUP}(?:${Regex.ALPHA})?${Regex.END}`,
        ],
        [
            'multiple optional parameters',
            '/{a?}/{b?}',
            [opt('a', Regex.ALPHA), opt('b', Regex.ALPHA)],
            `${Regex.START}${Regex.START_OPTIONAL_CAPTURE_GROUP}(?<a>${Regex.ALPHA})?${Regex.START_OPTIONAL_CAPTURE_GROUP}(?<b>${Regex.ALPHA})?${Regex.END}`,
        ],
        [
            'mixed capturing and non-capturing parameters',
            '/{cap}/{nc}',
            [cap('cap', Regex.ALPHA), noncap('nc', Regex.NUM)],
            `${Regex.START}${Regex.PATH}(?<cap>${Regex.ALPHA})${Regex.PATH}(?:${Regex.NUM})${Regex.END}`,
        ],
    ])('produces the exact regex for %s', (_label, path, parameters, expected) => {
        expect(processRegex(path, parameters)).toBe(expected);
    });

    it('makes a parameter optional when the path marks it with a question mark', () => {
        // Constructed as NOT optional; the '?' in the path must still make the regex optional.
        const regex = processRegex('/{opt?}', [new Parameter('opt', Regex.ALPHA)]);

        expect(regex).toBe(`${Regex.START}${Regex.START_OPTIONAL_CAPTURE_GROUP}(?<opt>${Regex.ALPHA})?${Regex.END}`);
    });

    it('leaves a non-dynamic route containing a brace as a static route', () => {
        const route = processor.route(new Route('/{notDynamic}', 'route', handler));

        expect(route).not.toBeInstanceOf(DynamicRoute);
        expect(route.getPath()).toBe('/{notDynamic}');
    });
});
