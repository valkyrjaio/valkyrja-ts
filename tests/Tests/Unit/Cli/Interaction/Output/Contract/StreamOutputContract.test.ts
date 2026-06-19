/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { StreamOutputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Output/Contract/StreamOutputContract.ts';

describe('StreamOutputContract', () => {
    it('instanceOf is true for an object exposing getStream', () => {
        expect(StreamOutputContract.instanceOf({ getStream: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(StreamOutputContract.instanceOf(null)).toBe(false);
        expect(StreamOutputContract.instanceOf({})).toBe(false);
    });
});
