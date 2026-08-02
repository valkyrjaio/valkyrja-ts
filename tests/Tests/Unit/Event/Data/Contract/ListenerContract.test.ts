/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ListenerContract } from '../../../../../../src/Valkyrja/Event/Data/Contract/ListenerContract.ts';

describe('ListenerContract', () => {
    it('instanceOf is true for an object exposing getEventId', () => {
        expect(ListenerContract.instanceOf({ getEventId: (): string => 'x' })).toBe(true);
    });

    it('instanceOf is false for non-listeners', () => {
        expect(ListenerContract.instanceOf(null)).toBe(false);
        expect(ListenerContract.instanceOf({})).toBe(false);
        expect(ListenerContract.instanceOf('listener')).toBe(false);
    });
});
