/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/HandlerContract.ts';

describe('HandlerContract', () => {
    it('instanceOf is true for an object exposing add', () => {
        expect(HandlerContract.instanceOf({ add: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(HandlerContract.instanceOf(null)).toBe(false);
        expect(HandlerContract.instanceOf({})).toBe(false);
    });
});
