import { ResponseFactory } from '../Response/Factory/ResponseFactory.js';
import { HttpMessageServiceId } from '../Constant/HttpMessageServiceId.js';

import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ResponseFactoryContract } from '../Response/Factory/Contract/ResponseFactoryContract.js';
import type { ServiceProviderContract } from '../../../Container/Provider/Contract/ServiceProviderContract.js';

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
