/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/ApplicationComponentProvider.ts';
import { ContainerComponentProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerComponentProvider.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const app = {} as unknown as ApplicationContract;

describe('ApplicationComponentProvider', () => {
    it('getComponentProviders returns the container component provider', () => {
        const providers = new ApplicationComponentProvider().getComponentProviders(app);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(ContainerComponentProvider);
    });

    it('getContainerProviders is empty', () => {
        expect(new ApplicationComponentProvider().getContainerProviders(app)).toHaveLength(0);
    });

    it('getEventProviders is empty', () => {
        expect(new ApplicationComponentProvider().getEventProviders(app)).toHaveLength(0);
    });

    it('getCliProviders is empty', () => {
        expect(new ApplicationComponentProvider().getCliProviders(app)).toHaveLength(0);
    });

    it('getHttpProviders is empty', () => {
        expect(new ApplicationComponentProvider().getHttpProviders(app)).toHaveLength(0);
    });
});
