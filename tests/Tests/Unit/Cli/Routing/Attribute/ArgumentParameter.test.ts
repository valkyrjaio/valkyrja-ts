/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
