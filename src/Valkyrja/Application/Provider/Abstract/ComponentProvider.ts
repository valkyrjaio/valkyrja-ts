/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { CliRouteProviderContract } from '../../../Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';
import type { ListenerProviderContract } from '../../../Event/Provider/Contract/ListenerProviderContract.ts';
import type { GrpcRouteProviderContract } from '../../../Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';
import type { HttpRouteProviderContract } from '../../../Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../Contract/ComponentProviderContract.ts';

/**
 * The base every component provider extends, implementing each provider method as empty so a
 * component overrides only what it actually contributes.
 *
 * The contract stays symmetric across protocols — no protocol is defaulted on the interface, which
 * would encode "this one is optional" about a contract that says no such thing of the others. The
 * cost of that symmetry, an identical empty implementation in every component, is a class problem
 * rather than a contract problem, and this base is where it is solved: adding the next protocol
 * touches one class instead of every component.
 */
export abstract class ComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [];
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

    getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
        return [];
    }
}
