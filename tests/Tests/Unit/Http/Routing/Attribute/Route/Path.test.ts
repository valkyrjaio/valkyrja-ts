/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
