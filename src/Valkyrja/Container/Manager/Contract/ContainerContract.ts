/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ContainerData } from '../../Data/ContainerData.ts';
import type { InvalidReferenceMode } from '../../Enum/InvalidReferenceMode.ts';
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
    get<T extends object>(id: string, args?: unknown[], mode?: InvalidReferenceMode): T;
    getAliased<T extends object>(id: string, args?: unknown[]): T;
    getService<T extends object>(id: string, args?: unknown[]): T;
    getSingleton<T extends object>(id: string): T;
}
