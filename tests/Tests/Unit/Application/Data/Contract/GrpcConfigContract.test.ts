/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import {
    DEFAULT_MAX_INBOUND_MESSAGES,
    GrpcConfigContract,
} from '../../../../../../src/Valkyrja/Application/Data/Contract/GrpcConfigContract.ts';

describe('GrpcConfigContract', () => {
    it('instanceOf is true for an object exposing maxInboundMessages', () => {
        expect(GrpcConfigContract.instanceOf({ maxInboundMessages: 1000 })).toBe(true);
    });

    it('instanceOf is false for non-configs', () => {
        expect(GrpcConfigContract.instanceOf(null)).toBe(false);
        expect(GrpcConfigContract.instanceOf({})).toBe(false);
    });

    it('publishes the default inbound message cap', () => {
        expect(DEFAULT_MAX_INBOUND_MESSAGES).toBe(1000);
    });
});
