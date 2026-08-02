/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ThrowableCaughtHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/ThrowableCaughtHandlerContract.ts';

describe('ThrowableCaughtHandlerContract', () => {
    it('instanceOf is true for an object exposing throwableCaught', () => {
        expect(ThrowableCaughtHandlerContract.instanceOf({ throwableCaught: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ThrowableCaughtHandlerContract.instanceOf(null)).toBe(false);
        expect(ThrowableCaughtHandlerContract.instanceOf({})).toBe(false);
    });
});
