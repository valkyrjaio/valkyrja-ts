/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.ts';
import { CliInteractionComponentProvider } from '../../Cli/Interaction/Provider/CliInteractionComponentProvider.ts';
import { CliMiddlewareComponentProvider } from '../../Cli/Middleware/Provider/CliMiddlewareComponentProvider.ts';
import { CliRoutingComponentProvider } from '../../Cli/Routing/Provider/CliRoutingComponentProvider.ts';
import { CliServerComponentProvider } from '../../Cli/Server/Provider/CliServerComponentProvider.ts';
import { HttpRoutingCliComponentProvider } from '../../Http/Routing/Provider/HttpRoutingCliComponentProvider.ts';
import { ApplicationComponentProvider } from './ApplicationComponentProvider.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.ts';

export class CliWithHttpApplicationComponentProvider extends ApplicationComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [
            new ContainerComponentProvider(),
            new CliInteractionComponentProvider(),
            new CliMiddlewareComponentProvider(),
            new CliRoutingComponentProvider(),
            new CliServerComponentProvider(),
            new HttpRoutingCliComponentProvider(),
        ];
    }
}
