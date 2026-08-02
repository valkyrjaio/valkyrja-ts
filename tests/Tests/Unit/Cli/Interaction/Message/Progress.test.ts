/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ProgressContract } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/ProgressContract.ts';
import { Progress } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Progress.ts';

describe('Progress', () => {
    it('defaults to incomplete with zero percentage', () => {
        const progress = new Progress('working');

        expect(progress.getText()).toBe('working');
        expect(progress.isComplete()).toBe(false);
        expect(progress.getPercentage()).toBe(0);
    });

    it('withIsComplete returns an immutable clone', () => {
        const progress = new Progress('working');
        const next = progress.withIsComplete(true);

        expect(next).not.toBe(progress);
        expect(progress.isComplete()).toBe(false);
        expect(next.isComplete()).toBe(true);
    });

    it('withPercentage returns an immutable clone', () => {
        const progress = new Progress('working');
        const next = progress.withPercentage(50);

        expect(next).not.toBe(progress);
        expect(progress.getPercentage()).toBe(0);
        expect(next.getPercentage()).toBe(50);
    });

    it('instanceOf is true for a Progress and false otherwise', () => {
        expect(ProgressContract.instanceOf(new Progress('working'))).toBe(true);
        expect(ProgressContract.instanceOf(null)).toBe(false);
        expect(ProgressContract.instanceOf({})).toBe(false);
    });
});
