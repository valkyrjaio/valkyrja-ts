/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../Provider/Abstract/ComponentProvider.ts';
import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.ts';

export class ApplicationComponentProvider extends ComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new ContainerComponentProvider()];
    }
}
