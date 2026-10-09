/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';

describe('CancellationReason', () => {
    it('names the two causes of cancellation', () => {
        expect(CancellationReason.CLIENT_CANCELLED).toBe('CLIENT_CANCELLED');
        expect(CancellationReason.DEADLINE_EXCEEDED).toBe('DEADLINE_EXCEEDED');
    });
});
