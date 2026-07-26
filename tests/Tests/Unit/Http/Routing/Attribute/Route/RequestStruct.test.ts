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
import { RequestStruct } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestStruct.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Http/Routing/Attribute/DecoratorContextFixture.ts';

import type { RequestStructContract } from '../../../../../../../src/Valkyrja/Http/Struct/Request/Contract/RequestStructContract.ts';

describe('RequestStruct attribute', () => {
    it('assigns the request struct to the method metadata', () => {
        const context = methodDecoratorContext('store');
        const struct = { marker: 'request' } as unknown as RequestStructContract;

        RequestStruct(struct)(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('store')?.requestStruct).toBe(struct);
    });
});
