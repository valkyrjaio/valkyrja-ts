/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ArgumentParameterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/ArgumentParameterContract.ts';

describe('ArgumentParameterContract', () => {
    it('instanceOf is true for an object exposing getMode', () => {
        expect(ArgumentParameterContract.instanceOf({ getMode: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ArgumentParameterContract.instanceOf(null)).toBe(false);
        expect(ArgumentParameterContract.instanceOf({})).toBe(false);
    });
});
