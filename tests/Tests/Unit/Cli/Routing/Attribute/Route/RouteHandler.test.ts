/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ensureCliRouteMetadata } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { RouteHandler } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/RouteHandler.ts';
import { methodDecoratorContext } from '../../../../../Fixtures/Cli/Routing/Attribute/DecoratorContextFixture.ts';

class CliRouteProvider {}

describe('Cli RouteHandler attribute', () => {
    it('assigns the handler reference to the method metadata', () => {
        const context = methodDecoratorContext('run');

        RouteHandler([CliRouteProvider, 'testCommandHandler'])(undefined, context);

        expect(ensureCliRouteMetadata(context.metadata).methods.get('run')?.handler).toStrictEqual([
            CliRouteProvider,
            'testCommandHandler',
        ]);
    });
});
