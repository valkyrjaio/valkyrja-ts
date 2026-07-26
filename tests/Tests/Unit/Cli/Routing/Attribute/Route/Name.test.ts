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
import { Name } from '../../../../../../../src/Valkyrja/Cli/Routing/Attribute/Route/Name.ts';
import {
    classDecoratorContext,
    methodDecoratorContext,
} from '../../../../../Fixtures/Cli/Routing/Attribute/DecoratorContextFixture.ts';

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
