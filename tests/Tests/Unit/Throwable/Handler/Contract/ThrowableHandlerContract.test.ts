/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ThrowableHandlerContract } from '../../../../../../src/Valkyrja/Throwable/Handler/Contract/ThrowableHandlerContract.ts';

describe('ThrowableHandlerContract', () => {
    it('instanceOf is true for an object exposing enable', () => {
        expect(ThrowableHandlerContract.instanceOf({ enable: (): void => {} })).toBe(true);
    });

    it('instanceOf is false for non-handlers', () => {
        expect(ThrowableHandlerContract.instanceOf(null)).toBe(false);
        expect(ThrowableHandlerContract.instanceOf({})).toBe(false);
    });
});
