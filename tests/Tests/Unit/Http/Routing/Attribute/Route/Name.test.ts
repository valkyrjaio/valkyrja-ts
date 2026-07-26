/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
