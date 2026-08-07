/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ContainerData } from '../../Data/ContainerData.ts';
import type { ProvidersAwareContract } from './ProvidersAwareContract.ts';

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
    get<T extends object>(id: string, args?: unknown[]): T;
    getAliased<T extends object>(id: string, args?: unknown[]): T;
    getService<T extends object>(id: string, args?: unknown[]): T;
    getSingleton<T extends object>(id: string): T;
}
