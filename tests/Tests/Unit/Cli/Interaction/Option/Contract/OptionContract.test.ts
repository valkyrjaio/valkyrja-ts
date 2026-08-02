/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { OptionContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Option/Contract/OptionContract.ts';

describe('OptionContract', () => {
    it('instanceOf is true for an object exposing getName', () => {
        expect(OptionContract.instanceOf({ getName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(OptionContract.instanceOf(null)).toBe(false);
        expect(OptionContract.instanceOf({})).toBe(false);
    });
});
