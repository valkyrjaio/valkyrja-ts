/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { allRequestMethods } from '../../../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ensureHttpRouteMetadata } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Any } from '../../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/RequestMethod/Any.ts';
import { methodDecoratorContext } from '../../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Any attribute', () => {
    it('adds every request method', () => {
        const context = methodDecoratorContext('home');

        Any()(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('home')?.addedRequestMethods).toStrictEqual(
            allRequestMethods(),
        );
    });
});
