/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliRoutingConfigContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/CliRoutingConfigContract.ts';

describe('CliRoutingConfigContract', () => {
    it('instanceOf is true for an object exposing dataClassName', () => {
        expect(CliRoutingConfigContract.instanceOf({ dataClassName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliRoutingConfigContract.instanceOf(null)).toBe(false);
        expect(CliRoutingConfigContract.instanceOf({})).toBe(false);
    });
});
