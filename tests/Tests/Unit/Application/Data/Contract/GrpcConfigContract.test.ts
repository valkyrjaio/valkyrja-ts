/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
