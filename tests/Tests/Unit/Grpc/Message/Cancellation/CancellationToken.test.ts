/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CancellationToken } from '../../../../../../src/Valkyrja/Grpc/Message/Cancellation/CancellationToken.ts';
import { CancellationReason } from '../../../../../../src/Valkyrja/Grpc/Message/Enum/CancellationReason.ts';
import { CancelledException } from '../../../../../../src/Valkyrja/Grpc/Throwable/Exception/CancelledException.ts';

describe('CancellationToken', () => {
    it('starts uncancelled with no reason', () => {
        const token = new CancellationToken();

        expect(token.isCancelled()).toBe(false);
        expect(token.getReason()).toBeNull();
        expect(() => {
            token.throwIfCancelled();
        }).not.toThrow();
    });

    it('never fires for the never() sentinel', () => {
        expect(CancellationToken.never().isCancelled()).toBe(false);
    });

    it('records the reason when cancelled', () => {
        const token = new CancellationToken();

        token.cancel(CancellationReason.DEADLINE_EXCEEDED);

        expect(token.isCancelled()).toBe(true);
        expect(token.getReason()).toBe(CancellationReason.DEADLINE_EXCEEDED);
    });

    it('throws a cancelled exception carrying the reason', () => {
        const token = new CancellationToken();

        token.cancel(CancellationReason.CLIENT_CANCELLED);

        expect(() => {
            token.throwIfCancelled();
        }).toThrow(CancelledException);

        try {
            token.throwIfCancelled();
        } catch (thrown) {
            expect(thrown).toBeInstanceOf(CancelledException);
            expect((thrown as CancelledException).getReason()).toBe(CancellationReason.CLIENT_CANCELLED);
        }
    });

    it('fires registered listeners on cancellation', () => {
        const token = new CancellationToken();
        const fired: string[] = [];

        token.onCancelled(() => fired.push('first'));
        token.onCancelled(() => fired.push('second'));

        token.cancel(CancellationReason.CLIENT_CANCELLED);

        expect(fired).toEqual(['first', 'second']);
    });

    it('runs a listener immediately when already cancelled', () => {
        const token = new CancellationToken();
        const fired: string[] = [];

        token.cancel(CancellationReason.CLIENT_CANCELLED);
        token.onCancelled(() => fired.push('late'));

        expect(fired).toEqual(['late']);
    });

    it('ignores a second cancellation so the first cause wins', () => {
        const token = new CancellationToken();
        const fired: string[] = [];

        token.onCancelled(() => fired.push('once'));

        token.cancel(CancellationReason.CLIENT_CANCELLED);
        token.cancel(CancellationReason.DEADLINE_EXCEEDED);

        expect(token.getReason()).toBe(CancellationReason.CLIENT_CANCELLED);
        expect(fired).toEqual(['once']);
    });
});
