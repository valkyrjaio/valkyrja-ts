/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ThrowableCaughtMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/ThrowableCaughtMiddlewareContract.ts';

describe('ThrowableCaughtMiddlewareContract', () => {
    it('instanceOf is true for an object exposing throwableCaught', () => {
        expect(ThrowableCaughtMiddlewareContract.instanceOf({ throwableCaught: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ThrowableCaughtMiddlewareContract.instanceOf(null)).toBe(false);
        expect(ThrowableCaughtMiddlewareContract.instanceOf({})).toBe(false);
    });
});
