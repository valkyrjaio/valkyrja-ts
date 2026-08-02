/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { InputReceivedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';

describe('InputReceivedHandlerContract', () => {
    it('instanceOf is true for an object exposing inputReceived', () => {
        expect(InputReceivedHandlerContract.instanceOf({ inputReceived: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(InputReceivedHandlerContract.instanceOf(null)).toBe(false);
        expect(InputReceivedHandlerContract.instanceOf({})).toBe(false);
    });
});
