/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod } from '../../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ensureHttpRouteMetadata } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Head } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestMethod/Head.ts';
import { methodDecoratorContext } from '../../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Head attribute', () => {
    it('adds the HEAD request method', () => {
        const context = methodDecoratorContext('home');

        Head()(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('home')?.addedRequestMethods).toStrictEqual([
            RequestMethod.HEAD,
        ]);
    });
});
