/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ProcessExitingMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/ProcessExitingMiddlewareContract.ts';

describe('ProcessExitingMiddlewareContract', () => {
    it('instanceOf is true for an object exposing processExiting', () => {
        expect(ProcessExitingMiddlewareContract.instanceOf({ processExiting: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ProcessExitingMiddlewareContract.instanceOf(null)).toBe(false);
        expect(ProcessExitingMiddlewareContract.instanceOf({})).toBe(false);
    });
});
