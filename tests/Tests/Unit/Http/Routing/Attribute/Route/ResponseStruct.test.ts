/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
