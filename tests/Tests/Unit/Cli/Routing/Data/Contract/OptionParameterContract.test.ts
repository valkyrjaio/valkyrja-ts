/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { OptionParameterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/OptionParameterContract.ts';

describe('OptionParameterContract', () => {
    it('instanceOf is true for an object exposing getShortNames', () => {
        expect(OptionParameterContract.instanceOf({ getShortNames: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(OptionParameterContract.instanceOf(null)).toBe(false);
        expect(OptionParameterContract.instanceOf({})).toBe(false);
    });
});
