/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { FormatContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Format/Contract/FormatContract.ts';

describe('FormatContract', () => {
    it('instanceOf is true for an object exposing getSetCode', () => {
        expect(FormatContract.instanceOf({ getSetCode: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(FormatContract.instanceOf(null)).toBe(false);
        expect(FormatContract.instanceOf({})).toBe(false);
    });
});
