/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';

describe('CancellationReason', () => {
    it('names the two causes of cancellation', () => {
        expect(CancellationReason.CLIENT_CANCELLED).toBe('CLIENT_CANCELLED');
        expect(CancellationReason.DEADLINE_EXCEEDED).toBe('DEADLINE_EXCEEDED');
    });
});
