/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ensureCliRouteMetadata } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { Name } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/Name.ts';
import {
    classDecoratorContext,
    methodDecoratorContext,
} from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Cli Name attribute', () => {
    it('adds a class-level name prefix', () => {
        const context = classDecoratorContext('AppCommand');

        Name('app')(undefined, context);

        expect(ensureCliRouteMetadata(context.metadata).classNames).toStrictEqual(['app']);
    });

    it('adds a method-level name segment', () => {
        const context = methodDecoratorContext('run');

        Name('run')(undefined, context);

        expect(ensureCliRouteMetadata(context.metadata).methods.get('run')?.names).toStrictEqual(['run']);
    });
});
