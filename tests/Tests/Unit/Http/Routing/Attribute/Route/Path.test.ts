/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ensureHttpRouteMetadata } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';
import { Path } from '../../../../../../../src/Valkyrja/Http/Routing/Attribute/Route/Path.ts';
import {
    classDecoratorContext,
    methodDecoratorContext,
} from '../../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('Path attribute', () => {
    it('adds a class-level path prefix', () => {
        const context = classDecoratorContext('AdminController');

        Path('/admin')(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).classPaths).toStrictEqual(['/admin']);
    });

    it('adds a method-level path segment', () => {
        const context = methodDecoratorContext('version');

        Path('/version')(undefined, context);

        expect(ensureHttpRouteMetadata(context.metadata).methods.get('version')?.paths).toStrictEqual(['/version']);
    });
});
