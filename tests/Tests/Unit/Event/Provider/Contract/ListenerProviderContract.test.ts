/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ListenerProviderContract } from '../../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';

describe('ListenerProviderContract', () => {
    it('instanceOf is true for an object exposing getListeners', () => {
        expect(ListenerProviderContract.instanceOf({ getListeners: (): [] => [] })).toBe(true);
    });

    it('instanceOf is false for non-providers', () => {
        expect(ListenerProviderContract.instanceOf(null)).toBe(false);
        expect(ListenerProviderContract.instanceOf({})).toBe(false);
    });
});
