/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliRoutingData } from '../../../../../../src/Valkyrja/Cli/Routing/Data/CliRoutingData.ts';
import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Route.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Cli/Routing/Collection/RouteCollection.ts';
import { CliRoutingInvalidRouteNameException } from '../../../../../../src/Valkyrja/Cli/Routing/Throwable/Exception/CliRoutingInvalidRouteNameException.ts';

import type { OutputContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const handler = (): OutputContract => ({}) as unknown as OutputContract;

describe('RouteCollection', () => {
    it('adds routes and looks them up by name', () => {
        const route = new Route('build', 'desc', handler);
        const collection = new RouteCollection().add(route);

        expect(collection.has('build')).toBe(true);
        expect(collection.has('missing')).toBe(false);
        expect(collection.get('build')).toBe(route);
    });

    it('throws when getting an unknown route', () => {
        expect(() => new RouteCollection().get('missing')).toThrow(CliRoutingInvalidRouteNameException);
    });

    it('returns all routes resolved', () => {
        const build = new Route('build', 'desc', handler);
        const test = new Route('test', 'desc', handler);
        const collection = new RouteCollection().add(build, test);

        expect(collection.all()).toStrictEqual({ build, test });
    });

    it('round-trips routes through data', () => {
        const route = new Route('build', 'desc', handler);
        const source = new RouteCollection().add(route);

        const data = source.getData();
        expect(data).toBeInstanceOf(CliRoutingData);

        const target = new RouteCollection();
        target.setFromData(data);

        expect(target.get('build')).toBe(route);
    });
});
