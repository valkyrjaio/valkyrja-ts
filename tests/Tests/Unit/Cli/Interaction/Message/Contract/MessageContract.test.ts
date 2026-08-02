/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { MessageContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/MessageContract.ts';

describe('MessageContract', () => {
    it('instanceOf is true for an object exposing getText', () => {
        expect(MessageContract.instanceOf({ getText: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(MessageContract.instanceOf(null)).toBe(false);
        expect(MessageContract.instanceOf({})).toBe(false);
    });
});
