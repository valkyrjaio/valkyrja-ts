/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliInteractionConfigContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Data/Contract/CliInteractionConfigContract.ts';

describe('CliInteractionConfigContract', () => {
    it('instanceOf is true for an object exposing isQuiet', () => {
        expect(CliInteractionConfigContract.instanceOf({ isQuiet: (): undefined => undefined })).toBe(true);
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliInteractionConfigContract.instanceOf(null)).toBe(false);
        expect(CliInteractionConfigContract.instanceOf({})).toBe(false);
    });
});
