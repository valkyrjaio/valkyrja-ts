/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod } from '../../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ensureHttpRouteMetadata } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Connect } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestMethod/Connect.ts';
import { methodDecoratorContext } from '../../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Connect attribute', () => {
    it('adds the CONNECT request method', () => {
        const context = methodDecoratorContext('home');

        Connect()(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('home')?.addedRequestMethods).toStrictEqual([
            RequestMethod.CONNECT,
        ]);
    });
});
