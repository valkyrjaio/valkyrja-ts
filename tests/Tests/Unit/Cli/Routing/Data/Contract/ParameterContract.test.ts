/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ParameterContract } from '../../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/ParameterContract.ts';

describe('ParameterContract', () => {
    it('instanceOf is true for an object exposing getName', () => {
        expect(ParameterContract.instanceOf({ getName: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(ParameterContract.instanceOf(null)).toBe(false);
        expect(ParameterContract.instanceOf({})).toBe(false);
    });
});
