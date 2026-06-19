/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ComponentProviderContract } from '../../../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';

describe('ComponentProviderContract', () => {
    it('instanceOf is true for an object exposing getComponentProviders', () => {
        expect(ComponentProviderContract.instanceOf({ getComponentProviders: (): [] => [] })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(ComponentProviderContract.instanceOf(null)).toBe(false);
        expect(ComponentProviderContract.instanceOf({})).toBe(false);
    });
});
