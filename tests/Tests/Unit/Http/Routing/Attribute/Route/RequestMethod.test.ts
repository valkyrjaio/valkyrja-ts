/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod as RequestMethodEnum } from '../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { RequestMethod } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestMethod.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('RequestMethod attribute', () => {
    it('adds each provided request method to the method metadata', () => {
        const context = methodDecoratorContext('home');

        RequestMethod(RequestMethodEnum.GET, RequestMethodEnum.HEAD)(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('home')?.addedRequestMethods).toStrictEqual([
            RequestMethodEnum.GET,
            RequestMethodEnum.HEAD,
        ]);
    });
});
