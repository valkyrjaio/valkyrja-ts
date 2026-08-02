/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ensureCliRouteMetadata } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { Middleware } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/Middleware.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

import type { CliMiddlewareReference } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';

class ExitMiddleware {
    processExiting(): never {
        throw new Error('not invoked');
    }
}

describe('Cli Middleware attribute', () => {
    it('appends each middleware, in order, for the same method', () => {
        const context = methodDecoratorContext('run');
        const middleware: CliMiddlewareReference = () => ExitMiddleware;

        Middleware(middleware)(undefined, context);
        Middleware(middleware)(undefined, context);

        expect(ensureCliRouteMetadata(context.metadata).methods.get('run')?.middleware).toStrictEqual([
            middleware,
            middleware,
        ]);
    });
});
