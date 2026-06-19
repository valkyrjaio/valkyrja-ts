/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { beforeEach, describe, expect, it } from 'vitest';

import { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';
import { ChildContainer } from '../../../../../src/Valkyrja/Container/Manager/ChildContainer.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';

import { ProviderClass } from '../../../Classes/Container/Provider/ProviderClass.ts';
import { ServiceClass } from '../../../Classes/Container/ServiceClass.ts';
import { SingletonClass } from '../../../Classes/Container/SingletonClass.ts';

const SERVICE_ID = 'ServiceClass';
const SINGLETON_ID = 'SingletonClass';

describe('ChildContainer', () => {
    let parent: Container;
    let child: ChildContainer;

    beforeEach(() => {
        parent = new Container();
        child = new ChildContainer(parent, new ContainerData());
    });

    it('isAlias falls back to the parent, and child aliases do not leak to the parent', () => {
        parent.bindAlias('parentAlias', SERVICE_ID);
        expect(child.isAlias('parentAlias')).toBe(true);
        expect(child.isAlias('unknown')).toBe(false);

        child.bindAlias('childAlias', SERVICE_ID);
        expect(child.isAlias('childAlias')).toBe(true);
        expect(parent.isAlias('childAlias')).toBe(false);
    });

    it('isService falls back to the parent, and child services do not leak to the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceClass.make(c));
        expect(child.isService(SERVICE_ID)).toBe(true);
        expect(child.isService('unknown')).toBe(false);

        const child2 = new ChildContainer(parent, new ContainerData());
        child2.bind('ChildOnly', (c) => ServiceClass.make(c));
        expect(child2.isService('ChildOnly')).toBe(true);
        expect(parent.isService('ChildOnly')).toBe(false);
    });

    it('isSingletonInstance falls back to the parent, and child instances do not leak to the parent', () => {
        parent.setSingleton(SINGLETON_ID, new SingletonClass());
        expect(child.isSingletonInstance(SINGLETON_ID)).toBe(true);
        expect(child.isSingleton(SINGLETON_ID)).toBe(true);

        const child2 = new ChildContainer(parent, new ContainerData());
        child2.setSingleton('ChildOnly', new SingletonClass());
        expect(child2.isSingletonInstance('ChildOnly')).toBe(true);
        expect(parent.isSingletonInstance('ChildOnly')).toBe(false);
    });

    it('isDeferred falls back to the parent, and child registrations do not leak to the parent', () => {
        parent.register(new ProviderClass());
        expect(child.isDeferred(ProviderClass.PROVIDED_ID)).toBe(true);

        const freshParent = new Container();
        const freshChild = new ChildContainer(freshParent, new ContainerData());
        freshChild.register(new ProviderClass());
        expect(freshChild.has(ProviderClass.PROVIDED_ID)).toBe(true);
        expect(freshParent.has(ProviderClass.PROVIDED_ID)).toBe(false);
    });

    it('isPublished falls back to the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceClass.make(c));
        expect(child.isPublished(SERVICE_ID)).toBe(true);

        child.bind('ChildService', (c) => ServiceClass.make(c));
        expect(child.isPublished('ChildService')).toBe(true);
    });

    it('getSingleton resolves a singleton instance from the parent', () => {
        const instance = new SingletonClass();
        parent.setSingleton(SINGLETON_ID, instance);

        expect(child.getSingleton(SINGLETON_ID)).toBe(instance);
    });

    it('getService resolves a service from the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceClass.make(c));

        expect(child.getService(SERVICE_ID)).toBeInstanceOf(ServiceClass);
    });

    it('getAliased resolves an aliased service from the parent', () => {
        parent.bind(SERVICE_ID, (c) => ServiceClass.make(c));
        parent.bindAlias('parentAlias', SERVICE_ID);

        expect(child.getAliased('parentAlias')).toBeInstanceOf(ServiceClass);
    });

    it('getService resolves a service bound on the child itself', () => {
        child.bind('ChildService', (c) => ServiceClass.make(c));

        expect(child.getService('ChildService')).toBeInstanceOf(ServiceClass);
    });

    it('getAliased resolves an alias bound on the child itself', () => {
        child.bind('ChildService', (c) => ServiceClass.make(c));
        child.bindAlias('childAlias', 'ChildService');

        expect(child.getAliased('childAlias')).toBeInstanceOf(ServiceClass);
    });
});
