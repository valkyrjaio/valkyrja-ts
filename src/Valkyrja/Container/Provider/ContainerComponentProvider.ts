/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerServiceProvider } from './ContainerServiceProvider.js';

import type { ApplicationContract } from '../../Application/Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from '../../Application/Provider/Contract/ComponentProviderContract.js';
import type { ServiceProviderContract } from './Contract/ServiceProviderContract.js';
import type { ListenerProviderContract } from '../../Event/Provider/Contract/ListenerProviderContract.js';
import type { CliRouteProviderContract } from '../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { HttpRouteProviderContract } from '../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';

export class ContainerComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new ContainerServiceProvider()];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
    }
}
