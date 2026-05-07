import type { ContainerData } from '../../Data/ContainerData.js';
import type { InvalidReferenceMode } from '../../Enum/InvalidReferenceMode.js';
import type { ProvidersAwareContract } from './ProvidersAwareContract.js';

export interface ContainerContract extends ProvidersAwareContract {
    getData(): ContainerData;
    setFromData(data: ContainerData): void;
    has(id: string): boolean;
    bind<T extends object>(id: string, factory: (container: ContainerContract, args?: unknown[]) => T): this;
    bindAlias(alias: string, id: string): this;
    bindSingleton<T extends object>(id: string, factory: (container: ContainerContract, args?: unknown[]) => T): this;
    setSingleton<T extends object>(id: string, singleton: T): this;
    isAlias(id: string): boolean;
    isService(id: string): boolean;
    isSingleton(id: string): boolean;
    isSingletonBinding(id: string): boolean;
    isSingletonInstance(id: string): boolean;
    get<T extends object>(id: string, args?: unknown[], mode?: InvalidReferenceMode): T;
    getAliased<T extends object>(id: string, args?: unknown[]): T;
    getService<T extends object>(id: string, args?: unknown[]): T;
    getSingleton<T extends object>(id: string): T;
}