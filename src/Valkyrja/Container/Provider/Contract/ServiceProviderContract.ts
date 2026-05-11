import { type ContainerContract } from '../../Manager/Contract/ContainerContract.js';

export interface ServiceProviderContract {}

export interface ServiceProviderConstructor {
    new(): ServiceProviderContract;
    publishers(): Record<string, (container: ContainerContract) => void>;
}
