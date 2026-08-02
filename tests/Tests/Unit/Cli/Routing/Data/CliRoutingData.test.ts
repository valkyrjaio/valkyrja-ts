/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliRoutingData } from '../../../../../../src/Valkyrja/Cli/Routing/Data/CliRoutingData.ts';

describe('CliRoutingData', () => {
    it('defaults to no routes', () => {
        expect(new CliRoutingData().routes).toStrictEqual({});
    });
});
