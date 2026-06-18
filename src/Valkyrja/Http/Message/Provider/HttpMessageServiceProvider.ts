/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ResponseFactory } from '../Response/Factory/ResponseFactory.ts';
import { HttpMessageServiceId } from '../Constant/HttpMessageServiceId.ts';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ResponseFactoryContract } from '../Response/Factory/Contract/ResponseFactoryContract.ts';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.ts';

export class HttpMessageServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [HttpMessageServiceId.ResponseFactoryContract]: HttpMessageServiceProvider.publishResponseFactory,
        };
    }

    static publishResponseFactory(this: void, container: ContainerContract): void {
        container.setSingleton<ResponseFactoryContract>(
            HttpMessageServiceId.ResponseFactoryContract,
            new ResponseFactory(),
        );
    }
}
