/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.ts';
import { ApplicationComponentProvider } from './ApplicationComponentProvider.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.ts';

export class HttpApplicationComponentProvider extends ApplicationComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new ContainerComponentProvider()];
    }
}
