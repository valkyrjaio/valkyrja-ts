/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Output } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Output.ts';
import { ensureCliRouteMetadata } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { RouteHandler } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/RouteHandler.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

class CliRouteProvider {
    static testCommandHandler(): Output {
        return new Output();
    }
}

const handlerThunk = () => CliRouteProvider;

describe('Cli RouteHandler attribute', () => {
    it('stores the class thunk unevaluated so the class binding is never dereferenced', () => {
        let calls = 0;
        const context = methodDecoratorContext('run');

        RouteHandler([
            () => {
                calls++;

                return CliRouteProvider;
            },
            'testCommandHandler',
        ])(undefined, context);

        expect(calls).toBe(0);
    });

    it('assigns the handler reference to the method metadata', () => {
        const context = methodDecoratorContext('run');

        RouteHandler([handlerThunk, 'testCommandHandler'])(undefined, context);

        expect(ensureCliRouteMetadata(context.metadata).methods.get('run')?.handler).toStrictEqual([
            handlerThunk,
            'testCommandHandler',
        ]);
    });
});
