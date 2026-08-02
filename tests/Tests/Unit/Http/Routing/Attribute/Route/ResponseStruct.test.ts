/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { ResponseStruct } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/ResponseStruct.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { ResponseStructContract } from '../../../../../../../src/Valkyrja/Http/Struct/Response/Contract/ResponseStructContract.ts';

describe('ResponseStruct attribute', () => {
    it('assigns the response struct to the method metadata', () => {
        const context = methodDecoratorContext('store');
        const struct = { marker: 'response' } as unknown as ResponseStructContract;

        ResponseStruct(struct)(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('store')?.responseStruct).toBe(struct);
    });
});
