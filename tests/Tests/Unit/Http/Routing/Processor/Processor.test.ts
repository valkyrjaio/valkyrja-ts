/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

        expect(route.getRegex()).toBe('/^\\/users\\/(?<id>\\d+)$/');
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
});
