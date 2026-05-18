import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.js';
import { ApplicationComponentProvider } from './ApplicationComponentProvider.js';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.js';

export class HttpApplicationComponentProvider extends ApplicationComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new ContainerComponentProvider()];
    }
}
