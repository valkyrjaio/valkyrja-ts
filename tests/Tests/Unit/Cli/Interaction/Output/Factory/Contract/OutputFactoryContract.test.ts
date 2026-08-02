/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { OutputFactoryContract } from '../../../../../../../../src/Valkyrja/Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.ts';

describe('OutputFactoryContract', () => {
    it('instanceOf is true for an object exposing createOutput', () => {
        expect(OutputFactoryContract.instanceOf({ createOutput: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(OutputFactoryContract.instanceOf(null)).toBe(false);
        expect(OutputFactoryContract.instanceOf({})).toBe(false);
    });
});
