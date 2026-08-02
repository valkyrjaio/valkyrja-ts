/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliVersionCommandConfigContract } from '../../../../../../../src/Valkyrja/Cli/Server/Data/Contract/CliVersionCommandConfigContract.ts';

describe('CliVersionCommandConfigContract', () => {
    it('instanceOf is true for an object exposing versionCommandName', () => {
        expect(CliVersionCommandConfigContract.instanceOf({ versionCommandName: (): undefined => undefined })).toBe(
            true,
        );
    });

    it('instanceOf is false for non-matching values', () => {
        expect(CliVersionCommandConfigContract.instanceOf(null)).toBe(false);
        expect(CliVersionCommandConfigContract.instanceOf({})).toBe(false);
    });
});
