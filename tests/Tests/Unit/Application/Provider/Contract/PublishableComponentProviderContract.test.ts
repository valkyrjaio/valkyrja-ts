/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { PublishableComponentProviderContract } from '../../../../../../src/Valkyrja/Application/Provider/Contract/PublishableComponentProviderContract.ts';

describe('PublishableComponentProviderContract', () => {
    it('instanceOf is true for an object exposing publish', () => {
        expect(PublishableComponentProviderContract.instanceOf({ publish: (): void => {} })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(PublishableComponentProviderContract.instanceOf(null)).toBe(false);
        expect(PublishableComponentProviderContract.instanceOf({})).toBe(false);
    });
});
