/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { RequestStruct } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestStruct.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { RequestStructContract } from '../../../../../../../src/Valkyrja/Http/Struct/Request/Contract/RequestStructContract.ts';

describe('RequestStruct attribute', () => {
    it('assigns the request struct to the method metadata', () => {
        const context = methodDecoratorContext('store');
        const struct = { marker: 'request' } as unknown as RequestStructContract;

        RequestStruct(struct)(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('store')?.requestStruct).toBe(struct);
    });
});
