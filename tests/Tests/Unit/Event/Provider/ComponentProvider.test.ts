/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventComponentProvider } from '../../../../../src/Valkyrja/Event/Provider/EventComponentProvider.ts';
import { EventServiceProvider } from '../../../../../src/Valkyrja/Event/Provider/EventServiceProvider.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('EventComponentProvider', () => {
    it('getComponentProviders is empty', () => {
        expect(new EventComponentProvider().getComponentProviders(app)).toHaveLength(0);
    });

    it('getContainerProviders returns the event service provider', () => {
        const providers = new EventComponentProvider().getContainerProviders(app);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(EventServiceProvider);
    });

    it('getEventProviders is empty', () => {
        expect(new EventComponentProvider().getEventProviders(app)).toHaveLength(0);
    });

    it('getCliProviders is empty', () => {
        expect(new EventComponentProvider().getCliProviders(app)).toHaveLength(0);
    });

    it('getHttpProviders is empty', () => {
        expect(new EventComponentProvider().getHttpProviders(app)).toHaveLength(0);
    });
});
