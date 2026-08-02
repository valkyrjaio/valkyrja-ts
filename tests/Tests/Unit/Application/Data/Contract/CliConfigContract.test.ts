/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliConfigContract } from '../../../../../../src/Valkyrja/Application/Data/Contract/CliConfigContract.ts';

describe('CliConfigContract', () => {
    it('instanceOf is true for an object exposing applicationName', () => {
        expect(CliConfigContract.instanceOf({ applicationName: 'app' })).toBe(true);
    });

    it('instanceOf is false for non-configs', () => {
        expect(CliConfigContract.instanceOf(null)).toBe(false);
        expect(CliConfigContract.instanceOf({})).toBe(false);
    });
});
