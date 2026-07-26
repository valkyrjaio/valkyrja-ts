/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Route } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route.ts';
import { ensureCliRouteMetadata } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../Fixtures/Cli/Routing/Attribute/DecoratorContextFixture.ts';

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
