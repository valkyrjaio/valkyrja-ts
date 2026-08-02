/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Config } from '../../../../../src/Valkyrja/Application/Data/Config.ts';
import { ChildApplication } from '../../../../../src/Valkyrja/Application/Kernel/ChildApplication.ts';
import { Valkyrja } from '../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';
import { ChildContainer } from '../../../../../src/Valkyrja/Container/Manager/ChildContainer.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { SingletonFixture } from '../../../Fixtures/Container/SingletonFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const SINGLETON_ID = 'SingletonFixture';

describe('ChildApplication', () => {
    let parentContainer: Container;
    let parent: Valkyrja;
    let childContainer: ChildContainer;
    let child: ChildApplication;

    beforeEach(() => {
        parentContainer = new Container();
        parent = new Valkyrja(parentContainer, new Config());
        childContainer = new ChildContainer(parentContainer, new ContainerData());
        child = new ChildApplication(parent, childContainer);
    });

    it('getContainer returns the child container, not the parent container', () => {
        expect(child.getContainer()).toBe(childContainer);
        expect(child.getContainer()).not.toBe(parent.getContainer());
    });

    it('publishProviderCallbacks delegates to the parent (callback receives the parent)', () => {
        let received: ApplicationContract | null = null;

        const callbackParentContainer = new Container();
        const callbackParent = new Valkyrja(
            callbackParentContainer,
            new Config(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                [
                    (app: ApplicationContract): void => {
                        received = app;
                    },
                ],
            ),
        );
        const callbackChild = new ChildApplication(
            callbackParent,
            new ChildContainer(callbackParentContainer, new ContainerData()),
        );

        callbackChild.publishProviderCallbacks();

        expect(received).toBe(callbackParent);
        expect(received).not.toBe(callbackChild);
    });

    it('getProviders delegates to the parent', () => {
        const value = parent.getProviders();
        const spy = vi.spyOn(parent, 'getProviders').mockReturnValue(value);

        expect(child.getProviders()).toBe(value);
        expect(spy).toHaveBeenCalledOnce();
    });

    it('getContainerProviders delegates to the parent', () => {
        const value = parent.getContainerProviders();
        const spy = vi.spyOn(parent, 'getContainerProviders').mockReturnValue(value);

        expect(child.getContainerProviders()).toBe(value);
        expect(spy).toHaveBeenCalledOnce();
    });

    it('getEventProviders delegates to the parent', () => {
        const value = parent.getEventProviders();
        const spy = vi.spyOn(parent, 'getEventProviders').mockReturnValue(value);

        expect(child.getEventProviders()).toBe(value);
        expect(spy).toHaveBeenCalledOnce();
    });

    it('getCliProviders delegates to the parent', () => {
        const value = parent.getCliProviders();
        const spy = vi.spyOn(parent, 'getCliProviders').mockReturnValue(value);

        expect(child.getCliProviders()).toBe(value);
        expect(spy).toHaveBeenCalledOnce();
    });

    it('getHttpProviders delegates to the parent', () => {
        const value = parent.getHttpProviders();
        const spy = vi.spyOn(parent, 'getHttpProviders').mockReturnValue(value);

        expect(child.getHttpProviders()).toBe(value);
        expect(spy).toHaveBeenCalledOnce();
    });

    it('getDebugMode delegates to the parent', () => {
        expect(child.getDebugMode()).toBe(parent.getDebugMode());
    });

    it('getEnvironment delegates to the parent', () => {
        expect(child.getEnvironment()).toBe(parent.getEnvironment());
    });

    it('getVersion delegates to the parent', () => {
        expect(child.getVersion()).toBe(parent.getVersion());
    });

    it('child container writes do not affect the parent container', () => {
        child.getContainer().setSingleton(SINGLETON_ID, new SingletonFixture());

        expect(parent.getContainer().isSingletonInstance(SINGLETON_ID)).toBe(false);
    });

    it('child container serves its own registrations', () => {
        const instance = new SingletonFixture();
        child.getContainer().setSingleton(SINGLETON_ID, instance);

        expect(child.getContainer().getSingleton(SINGLETON_ID)).toBe(instance);
    });

    it('multiple children have independent containers but share parent delegation', () => {
        const child2 = new ChildApplication(parent, new ChildContainer(parentContainer, new ContainerData()));

        expect(child.getContainer()).not.toBe(child2.getContainer());
        expect(child.getEnvironment()).toBe(child2.getEnvironment());
    });

    it('writes to one child container are isolated from sibling children', () => {
        const child2 = new ChildApplication(parent, new ChildContainer(parentContainer, new ContainerData()));

        child.getContainer().setSingleton(SINGLETON_ID, new SingletonFixture());

        expect(child2.getContainer().isSingletonInstance(SINGLETON_ID)).toBe(false);
    });
});
