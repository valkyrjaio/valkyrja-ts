import { Valkyrja } from '../../Kernel/Valkyrja.js';
import { Directory } from '../../Directory/Directory.js';
import { Config } from '../../Data/Config.js';
import { ContainerServiceProvider } from '../../../Container/Provider/ContainerServiceProvider.js';
import { Container } from '../../../Container/Manager/Container.js';
import { ApplicationServiceId } from '../../Constant/ApplicationServiceId.js';
import { ContainerServiceId } from '../../../Container/Constant/ContainerServiceId.js';
import { ThrowableServiceId } from '../../../Throwable/Constant/ThrowableServiceId.js';

import type { ApplicationContract } from '../../Kernel/Contract/ApplicationContract.js';
import type { ConfigContract } from '../../Data/Contract/ConfigContract.js';
import type { ContainerContract } from '../../../Container/Manager/Contract/ContainerContract.js';
import type { ContainerData } from '../../../Container/Data/ContainerData.js';
import type { ThrowableHandlerContract } from '../../../Throwable/Handler/Contract/ThrowableHandlerContract.js';

let appStartTime: number | undefined;

export abstract class App {
    static start(config: ConfigContract = new Config()): ApplicationContract {
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

    static app(config: ConfigContract = new Config()): ApplicationContract {
        const container = this.getContainer();
        const app = this.getApplication(container, config);

        this.bootstrapServices(app, container, config);

        return app;
    }

    static getApplication(container: ContainerContract, config: ConfigContract = new Config()): ApplicationContract {
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
