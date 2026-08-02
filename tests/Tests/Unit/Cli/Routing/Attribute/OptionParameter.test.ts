/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { OptionParameter } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/OptionParameter.ts';
import { ensureCliRouteMetadata } from '../../../../../../src/Valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';
import { methodDecoratorContext } from '../../../../Fixtures/Attribute/DecoratorContextFixture.ts';

describe('OptionParameter attribute', () => {
    it('records each option on the method metadata', () => {
        const context = methodDecoratorContext('run');

        OptionParameter({ name: 'verbose', description: 'Verbose output', shortNames: ['v'] })(undefined, context);

        expect(ensureCliRouteMetadata(context.metadata).methods.get('run')?.options).toStrictEqual([
            { name: 'verbose', description: 'Verbose output', shortNames: ['v'] },
        ]);
    });
});
