/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ExitedMiddlewareContract } from '../../../../../../src/Valkyrja/Cli/Middleware/Contract/ExitedMiddlewareContract.ts';

describe('ExitedMiddlewareContract', () => {
    it('instanceOf is true for an object exposing exited', () => {
        expect(ExitedMiddlewareContract.instanceOf({ exited: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ExitedMiddlewareContract.instanceOf(null)).toBe(false);
        expect(ExitedMiddlewareContract.instanceOf({})).toBe(false);
    });
});
