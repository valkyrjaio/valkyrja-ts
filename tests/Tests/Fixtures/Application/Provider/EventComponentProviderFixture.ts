/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { ListenerProviderFixture } from '../../Event/Provider/ListenerProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ListenerProviderContract } from '../../../../../src/Valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';

export class EventComponentProviderFixture extends ComponentProvider {
    override getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [new ListenerProviderFixture()];
    }
}
