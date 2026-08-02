/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { WriterContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Writer/Contract/WriterContract.ts';

describe('WriterContract', () => {
    it('instanceOf is true for an object exposing write', () => {
        expect(WriterContract.instanceOf({ write: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(WriterContract.instanceOf(null)).toBe(false);
        expect(WriterContract.instanceOf({})).toBe(false);
    });
});
