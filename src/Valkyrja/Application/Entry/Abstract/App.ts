/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Valkyrja } from '../../Kernel/Valkyrja.ts';
import { Directory } from '../../Directory/Directory.ts';
import { ContainerServiceProvider } from '../../../Container/Provider/ContainerServiceProvider.ts';
import { Container } from '../../../Container/Manager/Container.ts';
import { ApplicationServiceId } from '../../Constant/ApplicationServiceId.ts';
import { ContainerServiceId } from '../../../Container/Constant/ContainerServiceId.ts';
import { ThrowableServiceId } from '../../../Throwable/Constant/ThrowableServiceId.ts';

import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.ts';
import type { ConfigContract } from '../../Data/Contract/ConfigContract.ts';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.ts';
import type { ContainerData } from '../../../Container/Data/ContainerData.ts';
import type { ThrowableHandlerContract } from '../../../Throwable/Handler/Contract/ThrowableHandlerContract.ts';

let appStartTime: number | undefined;

export abstract class App {
    static start(config: ConfigContract): ApplicationContract {
        if (config.debugMode) {
            this.defaultExceptionHandler();
        }

        this.appStart();
        this.directory(config.dir);

        return this.app(config);
    }

    static appStart(): void {
        if (appStartTime === undefined) {
            appStartTime = performance.now();
        }
    }

    static directory(dir: string): void {
        Directory.basePath = dir;
    }

    static app(config: ConfigContract): ApplicationContract {
        const container = this.getContainer();
        const app = this.getApplication(container, config);

        this.bootstrapServices(app, container, config);

        return app;
    }

    static getApplication(container: ContainerContract, config: ConfigContract): ApplicationContract {
        return new Valkyrja(container, config);
    }

    static bootstrapServices(app: ApplicationContract, container: ContainerContract, config: ConfigContract): void {
        container.setSingleton(ApplicationServiceId.ConfigContract, config);
        container.setSingleton(ApplicationServiceId.Config, config);

        const concreteConfigId = (config.constructor as { id?: string }).id;

        if (concreteConfigId !== undefined && concreteConfigId !== ApplicationServiceId.Config) {
            container.setSingleton(concreteConfigId, config);
        }

        container.setSingleton(ContainerServiceId.Contract, container);
        container.setSingleton(ApplicationServiceId.ApplicationContract, app);

        app.publishProviderCallbacks();

        this.loadContainerData(container);
    }

    static loadContainerData(container: ContainerContract): void {
        if (!container.isSingleton(ContainerServiceId.Data)) {
            this.publishContainerData(container);
        }

        const containerData = container.getSingleton<ContainerData>(ContainerServiceId.Data);

        container.setFromData(containerData);
    }

    static publishContainerData(container: ContainerContract): void {
        ContainerServiceProvider.publishData(container);
    }

    static defaultExceptionHandler(): void {
        // Override to register a throwable handler for debug mode.
    }

    static bootstrapThrowableHandler(app: ApplicationContract, container: ContainerContract): void {
        if (app.getDebugMode()) {
            const errorHandler = this.getThrowableHandler();

            container.setSingleton(ThrowableServiceId.HandlerContract, errorHandler);

            (errorHandler.constructor as { enable?: (opts: { displayErrors: boolean }) => void }).enable?.({
                displayErrors: true,
            });
        }
    }

    static getThrowableHandler(): ThrowableHandlerContract {
        return { enable: () => {} };
    }

    static getContainer(): ContainerContract {
        return new Container();
    }
}
