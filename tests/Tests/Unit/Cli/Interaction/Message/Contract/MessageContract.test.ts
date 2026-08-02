/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { MessageContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Message/Contract/MessageContract.ts';

describe('MessageContract', () => {
    it('instanceOf is true for an object exposing getText', () => {
        expect(MessageContract.instanceOf({ getText: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(MessageContract.instanceOf(null)).toBe(false);
        expect(MessageContract.instanceOf({})).toBe(false);
    });
});
