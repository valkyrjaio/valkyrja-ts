/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ServiceProviderContract } from '../../../../../../src/Valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

describe('ServiceProviderContract', () => {
    it('instanceOf is true for an object exposing publishers', () => {
        expect(ServiceProviderContract.instanceOf({ publishers: {} })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(ServiceProviderContract.instanceOf(null)).toBe(false);
        expect(ServiceProviderContract.instanceOf({})).toBe(false);
    });
});
