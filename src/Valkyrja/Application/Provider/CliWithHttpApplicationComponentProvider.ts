/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.js';
import { CliInteractionComponentProvider } from '../../Cli/Interaction/Provider/CliInteractionComponentProvider.js';
import { CliMiddlewareComponentProvider } from '../../Cli/Middleware/Provider/CliMiddlewareComponentProvider.js';
import { CliRoutingComponentProvider } from '../../Cli/Routing/Provider/CliRoutingComponentProvider.js';
import { CliServerComponentProvider } from '../../Cli/Server/Provider/CliServerComponentProvider.js';
import { HttpRoutingCliComponentProvider } from '../../Http/Routing/Provider/HttpRoutingCliComponentProvider.js';
import { ApplicationComponentProvider } from './ApplicationComponentProvider.js';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.js';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.js';

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
