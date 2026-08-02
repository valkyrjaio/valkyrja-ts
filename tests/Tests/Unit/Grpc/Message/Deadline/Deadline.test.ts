/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Deadline } from '../../../../../../src/Valkyrja/Grpc/Message/Deadline/Deadline.ts';

/** A clock the test advances by hand, so no assertion depends on wall-clock time. */
const fixedClock = (now: number): (() => number) => {
    return () => now;
};

describe('Deadline', () => {
    it('reports no deadline for the none() sentinel', () => {
        const deadline = Deadline.none(fixedClock(1_000));

        expect(deadline.hasDeadline()).toBe(false);
        expect(deadline.isExpired()).toBe(false);
        expect(deadline.getAbsoluteTime()).toBe(Number.POSITIVE_INFINITY);
        expect(deadline.getRemaining()).toBe(Deadline.INFINITE_REMAINING);
    });

    it('defaults the none() sentinel to the system clock', () => {
        expect(Deadline.none().hasDeadline()).toBe(false);
    });

    it('computes an absolute time from a timeout', () => {
        const deadline = Deadline.fromTimeout(500, fixedClock(1_000));

        expect(deadline.hasDeadline()).toBe(true);
        expect(deadline.getAbsoluteTime()).toBe(1_500);
        expect(deadline.getRemaining()).toBe(500);
        expect(deadline.isExpired()).toBe(false);
    });

    it('defaults fromTimeout() to the system clock', () => {
        expect(Deadline.fromTimeout(500).hasDeadline()).toBe(true);
    });

    it('accepts an absolute time directly', () => {
        const deadline = Deadline.fromAbsolute(2_000, fixedClock(1_000));

        expect(deadline.getAbsoluteTime()).toBe(2_000);
        expect(deadline.getRemaining()).toBe(1_000);
    });

    it('defaults fromAbsolute() to the system clock', () => {
        expect(Deadline.fromAbsolute(Date.now() + 1_000).hasDeadline()).toBe(true);
    });

    it('clamps the remaining budget at zero once elapsed', () => {
        const deadline = Deadline.fromAbsolute(500, fixedClock(1_000));

        expect(deadline.getRemaining()).toBe(0);
        expect(deadline.isExpired()).toBe(true);
    });

    it('treats the exact expiry instant as expired', () => {
        const deadline = Deadline.fromAbsolute(1_000, fixedClock(1_000));

        expect(deadline.isExpired()).toBe(true);
        expect(deadline.getRemaining()).toBe(0);
    });

    it('publishes a finite infinite-remaining sentinel', () => {
        expect(Deadline.INFINITE_REMAINING).toBe(365 * 100 * 24 * 60 * 60 * 1000);
        expect(Number.isFinite(Deadline.INFINITE_REMAINING)).toBe(true);
    });
});
