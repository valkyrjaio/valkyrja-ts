/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliSilentInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliSilentInteractionConfigContract.ts';

describe('CliSilentInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing silentOptionName', () => {
        expect(CliSilentInteractionConfigContract.instanceOf({ silentOptionName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliSilentInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliSilentInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
