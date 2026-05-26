/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.js';
import type { HttpRouteProviderContract } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';
import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';

export interface ComponentProviderContract {
    getComponentProviders(app: ApplicationContract): ComponentProviderContract[];
    getContainerProviders(app: ApplicationContract): ServiceProviderContract[];
    getEventProviders(app: ApplicationContract): ListenerProviderContract[];
    getCliProviders(app: ApplicationContract): CliRouteProviderContract[];
    getHttpProviders(app: ApplicationContract): HttpRouteProviderContract[];
}

export namespace ComponentProviderContract {
    export function instanceOf(value: unknown): value is ComponentProviderContract {
        return typeof value === 'object' && value !== null && 'getComponentProviders' in value;
    }
}
