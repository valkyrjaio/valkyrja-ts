/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route.ts';
import { ensureCliRouteMetadata } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Cli Route attribute', () => {
    it('records a command definition and is repeatable', () => {
        const context = methodDecoratorContext('run');

        Route({ name: 'test', description: 'Test command' })(undefined, context);
        Route({ name: 'test.alias', description: 'Alias command' })(undefined, context);

        expect(
            ensureCliRouteMetadata(context.metadata)
                .methods.get('run')
                ?.routes.map((route) => route.name),
        ).toStrictEqual(['test', 'test.alias']);
    });
});
