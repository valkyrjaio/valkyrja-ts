/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { EventData } from '../../../../../src/Valkyrja/Event/Data/EventData.ts';

describe('EventData', () => {
    it('has empty defaults', () => {
        const data = new EventData();

        expect(data.events).toStrictEqual({});
        expect(data.listeners).toStrictEqual({});
    });
});
