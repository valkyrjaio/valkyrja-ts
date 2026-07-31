/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ComponentProvider } from '../../../Application/Provider/Abstract/ComponentProvider.ts';
import { GrpcServerServiceProvider } from './GrpcServerServiceProvider.ts';

import type { ApplicationContract } from '../../../Application/Kernel/Contract/ApplicationContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';

export class GrpcServerComponentProvider extends ComponentProvider {
    override getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new GrpcServerServiceProvider()];
    }
}
