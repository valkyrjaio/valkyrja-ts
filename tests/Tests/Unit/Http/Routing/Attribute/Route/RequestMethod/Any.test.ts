/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { allRequestMethods } from '../../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ensureHttpRouteMetadata } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Any } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestMethod/Any.ts';
import { methodDecoratorContext } from '../../../../../../Fixtures/Http/Routing/Attribute/DecoratorContextFixture.ts';

describe('Any attribute', () => {
    it('adds every request method', () => {
        const context = methodDecoratorContext('home');

        Any()(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('home')?.addedRequestMethods).toStrictEqual(
            allRequestMethods(),
        );
    });
});
