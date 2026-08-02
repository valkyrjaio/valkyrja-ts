/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ArgumentParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/ArgumentParameter.ts';
import { ensureCliRouteMetadata } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('ArgumentParameter attribute', () => {
    it('records each argument on the method metadata', () => {
        const context = methodDecoratorContext('run');

        ArgumentParameter({ name: 'file', description: 'A file' })(undefined, context);

        expect(ensureCliRouteMetadata(context.metadata).methods.get('run')?.arguments).toStrictEqual([
            { name: 'file', description: 'A file' },
        ]);
    });
});
