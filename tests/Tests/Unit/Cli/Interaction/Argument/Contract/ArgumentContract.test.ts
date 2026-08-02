/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ArgumentContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Argument/Contract/ArgumentContract.ts';

describe('ArgumentContract', () => {
    it('instanceOf is true for an object exposing getValue', () => {
        expect(ArgumentContract.instanceOf({ getValue: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ArgumentContract.instanceOf(null)).toBe(false);
        expect(ArgumentContract.instanceOf({})).toBe(false);
    });
});
