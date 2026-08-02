/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
