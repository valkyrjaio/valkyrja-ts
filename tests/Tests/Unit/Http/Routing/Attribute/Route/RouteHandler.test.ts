/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { RouteHandler } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RouteHandler.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

class HttpRouteProvider {}

describe('RouteHandler attribute', () => {
    it('assigns the handler reference to the method metadata', () => {
        const context = methodDecoratorContext('version');

        RouteHandler([HttpRouteProvider, 'versionHandler'])(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('version')?.handler).toStrictEqual([
            HttpRouteProvider,
            'versionHandler',
        ]);
    });
});
