/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ConfigContract } from '../../../../../../src/Valkyrja/Application/Data/Contract/ConfigContract.ts';

describe('ConfigContract', () => {
    it('instanceOf is true for an object exposing namespace', () => {
        expect(ConfigContract.instanceOf({ namespace: 'App' })).toBe(true);
    });

    it('instanceOf is false for non-configs', () => {
        expect(ConfigContract.instanceOf(null)).toBe(false);
        expect(ConfigContract.instanceOf({})).toBe(false);
    });
});
