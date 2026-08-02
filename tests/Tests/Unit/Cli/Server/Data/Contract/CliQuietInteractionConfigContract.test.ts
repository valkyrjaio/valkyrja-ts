/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliQuietInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliQuietInteractionConfigContract.ts';

describe('CliQuietInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing quietOptionName', () => {
        expect(CliQuietInteractionConfigContract.instanceOf({ quietOptionName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliQuietInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliQuietInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
