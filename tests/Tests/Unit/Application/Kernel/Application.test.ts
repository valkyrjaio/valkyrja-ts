/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Config } from '../../../../../src/Valkyrja/Application/Data/Config.ts';
import { Valkyrja } from '../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { ApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/ApplicationComponentProvider.ts';
import { CliWithHttpApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/CliWithHttpApplicationComponentProvider.ts';
import { CliInteractionComponentProvider } from '../../../../../src/Valkyrja/Cli/Interaction/Provider/CliInteractionComponentProvider.ts';
import { CliMiddlewareComponentProvider } from '../../../../../src/Valkyrja/Cli/Middleware/Provider/CliMiddlewareComponentProvider.ts';
import { CliRoutingComponentProvider } from '../../../../../src/Valkyrja/Cli/Routing/Provider/CliRoutingComponentProvider.ts';
import { CliServerComponentProvider } from '../../../../../src/Valkyrja/Cli/Server/Provider/CliServerComponentProvider.ts';
import { ContainerComponentProvider } from '../../../../../src/Valkyrja/Container/Provider/ContainerComponentProvider.ts';
import { Container } from '../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { HttpRoutingCliComponentProvider } from '../../../../../src/Valkyrja/Http/Routing/Provider/HttpRoutingCliComponentProvider.ts';

import { CliComponentProviderFixture } from '../../../Fixtures/Application/Provider/CliComponentProviderFixture.ts';
import { CliContainerDataProviderFixture } from '../../../Fixtures/Application/Provider/CliContainerDataProviderFixture.ts';
import { CliRouteComponentProviderFixture } from '../../../Fixtures/Application/Provider/CliRouteComponentProviderFixture.ts';
import { CliRouteProviderFixture } from '../../../Fixtures/Application/Provider/CliRouteProviderFixture.ts';
import { CliRoutingDataProviderFixture } from '../../../Fixtures/Application/Provider/CliRoutingDataProviderFixture.ts';
import { ComponentProviderFixture } from '../../../Fixtures/Application/Provider/ComponentProviderFixture.ts';
import { EventComponentProviderFixture } from '../../../Fixtures/Application/Provider/EventComponentProviderFixture.ts';
import { HttpComponentProviderFixture } from '../../../Fixtures/Application/Provider/HttpComponentProviderFixture.ts';
import { HttpContainerDataProviderFixture } from '../../../Fixtures/Application/Provider/HttpContainerDataProviderFixture.ts';
import { HttpRouteComponentProviderFixture } from '../../../Fixtures/Application/Provider/HttpRouteComponentProviderFixture.ts';
import { HttpRouteProviderFixture } from '../../../Fixtures/Application/Provider/HttpRouteProviderFixture.ts';
import { HttpRoutingDataProviderFixture } from '../../../Fixtures/Application/Provider/HttpRoutingDataProviderFixture.ts';
import { ListenerProviderFixture } from '../../../Fixtures/Event/Provider/ListenerProviderFixture.ts';

import type { ApplicationContract } from '../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../../../../../src/Valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';

// Config's constructor is positional; providers is the 10th argument and callbacks the 11th.
const makeConfig = (
    providers: ComponentProviderContract[],
    callbacks: ((app: ApplicationContract) => void)[] = [],
): Config =>
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
        providers,
        callbacks,
    );

interface KernelInternals {
    providers: unknown[];
    serviceProviders: unknown[];
    eventProviders: unknown[];
    cliRouteProviders: unknown[];
    httpRouteProviders: unknown[];
}

const internals = (app: Valkyrja): KernelInternals => app as unknown as KernelInternals;

describe('Application (Valkyrja kernel)', () => {
    it('exposes the container and config-derived getters with defaults', () => {
        const config = new Config();
        const container = new Container();

        const application = new Valkyrja(container, config);

        expect(application.getContainer()).toBe(container);
        expect(application.getEnvironment()).toBe(config.environment);
        expect(application.getDebugMode()).toBe(config.debugMode);
        expect(application.getVersion()).toBe(config.version);
        expect(process.env['TZ']).toBe(config.timezone);

        // TS port has no Event component provider yet, so getProviders yields [Container, Application]
        const providers = application.getProviders();
        expect(providers).toHaveLength(2);
        expect(providers[0]).toBeInstanceOf(ContainerComponentProvider);
        expect(providers[1]).toBeInstanceOf(ApplicationComponentProvider);
    });

    it('expands the providers of a custom component provider', () => {
        const config = makeConfig([new CliWithHttpApplicationComponentProvider(), new CliComponentProviderFixture()]);

        const providers = new Valkyrja(new Container(), config).getProviders();

        // TS lists (no Log/View/Event providers yet): the 6 from CliWithHttp + the two config providers
        expect(providers).toHaveLength(8);
        expect(providers[0]).toBeInstanceOf(ContainerComponentProvider);
        expect(providers[1]).toBeInstanceOf(CliInteractionComponentProvider);
        expect(providers[2]).toBeInstanceOf(CliMiddlewareComponentProvider);
        expect(providers[3]).toBeInstanceOf(CliRoutingComponentProvider);
        expect(providers[4]).toBeInstanceOf(CliServerComponentProvider);
        expect(providers[5]).toBeInstanceOf(HttpRoutingCliComponentProvider);
        expect(providers[6]).toBeInstanceOf(CliWithHttpApplicationComponentProvider);
        expect(providers[7]).toBeInstanceOf(CliComponentProviderFixture);
    });

    it('getProviders expands nested component providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderFixture()]));

        const providers = application.getProviders();

        expect(providers).toHaveLength(3);
        expect(providers[0]).toBeInstanceOf(CliComponentProviderFixture);
        expect(providers[1]).toBeInstanceOf(HttpComponentProviderFixture);
        expect(providers[2]).toBeInstanceOf(ComponentProviderFixture);
    });

    it('getProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderFixture()]));

        expect(internals(application).providers).toStrictEqual([]);

        const result = application.getProviders();

        expect(result).toHaveLength(3);
        expect(internals(application).providers).toBe(result);
        expect(application.getProviders()).toBe(result);
    });

    it('getContainerProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderFixture()]));

        const result = application.getContainerProviders();

        expect(result).toHaveLength(4);
        expect(result[0]).toBeInstanceOf(CliContainerDataProviderFixture);
        expect(result[1]).toBeInstanceOf(CliRoutingDataProviderFixture);
        expect(result[2]).toBeInstanceOf(HttpContainerDataProviderFixture);
        expect(result[3]).toBeInstanceOf(HttpRoutingDataProviderFixture);
    });

    it('getContainerProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderFixture()]));

        expect(internals(application).serviceProviders).toStrictEqual([]);

        const result = application.getContainerProviders();

        expect(result).toHaveLength(4);
        expect(internals(application).serviceProviders).toBe(result);
        expect(application.getContainerProviders()).toBe(result);
    });

    it('getEventProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new EventComponentProviderFixture()]));

        const result = application.getEventProviders();

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(ListenerProviderFixture);
    });

    it('getEventProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new EventComponentProviderFixture()]));

        expect(internals(application).eventProviders).toStrictEqual([]);

        const result = application.getEventProviders();

        expect(result).toHaveLength(1);
        expect(internals(application).eventProviders).toBe(result);
        expect(application.getEventProviders()).toBe(result);
    });

    it('getCliProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new CliRouteComponentProviderFixture()]));

        const result = application.getCliProviders();

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(CliRouteProviderFixture);
    });

    it('getCliProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new CliRouteComponentProviderFixture()]));

        expect(internals(application).cliRouteProviders).toStrictEqual([]);

        const result = application.getCliProviders();

        expect(result).toHaveLength(1);
        expect(internals(application).cliRouteProviders).toBe(result);
        expect(application.getCliProviders()).toBe(result);
    });

    it('getHttpProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new HttpRouteComponentProviderFixture()]));

        const result = application.getHttpProviders();

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(HttpRouteProviderFixture);
    });

    it('getHttpProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new HttpRouteComponentProviderFixture()]));

        expect(internals(application).httpRouteProviders).toStrictEqual([]);

        const result = application.getHttpProviders();

        expect(result).toHaveLength(1);
        expect(internals(application).httpRouteProviders).toBe(result);
        expect(application.getHttpProviders()).toBe(result);
    });

    it('publishProviderCallbacks invokes each callback with the application', () => {
        const received: ApplicationContract[] = [];
        const config = makeConfig(
            [],
            [
                (app: ApplicationContract): void => {
                    received.push(app);
                },
                (app: ApplicationContract): void => {
                    received.push(app);
                },
            ],
        );

        const application = new Valkyrja(new Container(), config);
        application.publishProviderCallbacks();

        expect(received).toHaveLength(2);
        expect(received[0]).toBe(application);
        expect(received[1]).toBe(application);
    });

    it('the provider getters return empty arrays when there are no providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([]));

        expect(application.getProviders()).toHaveLength(0);
        expect(application.getContainerProviders()).toHaveLength(0);
        expect(application.getEventProviders()).toHaveLength(0);
        expect(application.getCliProviders()).toHaveLength(0);
        expect(application.getHttpProviders()).toHaveLength(0);
    });

    it('publishProviderCallbacks with no callbacks does nothing', () => {
        const application = new Valkyrja(new Container(), makeConfig([], []));

        expect(() => {
            application.publishProviderCallbacks();
        }).not.toThrow();
    });
});
