/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
