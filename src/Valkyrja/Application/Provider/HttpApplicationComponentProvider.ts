/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.js';
import { ApplicationComponentProvider } from './ApplicationComponentProvider.js';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.js';

export class HttpApplicationComponentProvider extends ApplicationComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new ContainerComponentProvider()];
    }
}
