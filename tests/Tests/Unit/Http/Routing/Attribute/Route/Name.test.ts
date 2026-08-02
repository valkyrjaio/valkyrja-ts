/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Name } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Name.ts';
import {
    classDecoratorContext,
    methodDecoratorContext,
} from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Name attribute', () => {
    it('adds a class-level name prefix', () => {
        const context = classDecoratorContext('AdminController');

        Name('admin')(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).classNames).toStrictEqual(['admin']);
    });

    it('adds a method-level name segment', () => {
        const context = methodDecoratorContext('version');

        Name('version')(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('version')?.names).toStrictEqual(['version']);
    });
});
