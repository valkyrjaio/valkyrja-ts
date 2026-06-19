/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { EventServiceId } from '../../../../../src/Valkyrja/Event/Constant/EventServiceId.ts';

describe('EventServiceId', () => {
    it('exposes the EventData service id', () => {
        expect(EventServiceId.EventData).toBe('Valkyrja.Event.Data.EventData');
    });
});
