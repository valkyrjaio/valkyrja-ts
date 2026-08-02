/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerComponentProvider } from '../../Container/Provider/ContainerComponentProvider.ts';
import { HttpMessageComponentProvider } from '../../Http/Message/Provider/HttpMessageComponentProvider.ts';
import { HttpMiddlewareComponentProvider } from '../../Http/Middleware/Provider/HttpMiddlewareComponentProvider.ts';
import { HttpRoutingCliComponentProvider } from '../../Http/Routing/Provider/HttpRoutingCliComponentProvider.ts';
import { HttpRoutingComponentProvider } from '../../Http/Routing/Provider/HttpRoutingComponentProvider.ts';
import { HttpServerComponentProvider } from '../../Http/Server/Provider/HttpServerComponentProvider.ts';
import { ApplicationComponentProvider } from './ApplicationComponentProvider.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from './Contract/ComponentProviderContract.ts';

export class HttpApplicationComponentProvider extends ApplicationComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [
            new ContainerComponentProvider(),
            new HttpMessageComponentProvider(),
            new HttpMiddlewareComponentProvider(),
            new HttpRoutingComponentProvider(),
            new HttpRoutingCliComponentProvider(),
            new HttpServerComponentProvider(),
        ];
    }
}
