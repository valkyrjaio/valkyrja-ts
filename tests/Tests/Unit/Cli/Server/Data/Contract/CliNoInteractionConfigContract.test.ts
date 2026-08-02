/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliNoInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliNoInteractionConfigContract.ts';

describe('CliNoInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing noInteractionOptionName', () => {
        expect(CliNoInteractionConfigContract.instanceOf({ noInteractionOptionName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliNoInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliNoInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
