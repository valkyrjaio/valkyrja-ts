/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

import { CliComponentProviderClass } from '../../../Fixtures/Application/Provider/CliComponentProviderClass.ts';
import { CliContainerDataProviderClass } from '../../../Fixtures/Application/Provider/CliContainerDataProviderClass.ts';
import { CliRouteComponentProviderClass } from '../../../Fixtures/Application/Provider/CliRouteComponentProviderClass.ts';
import { CliRouteProviderClass } from '../../../Fixtures/Application/Provider/CliRouteProviderClass.ts';
import { CliRoutingDataProviderClass } from '../../../Fixtures/Application/Provider/CliRoutingDataProviderClass.ts';
import { ComponentProviderClass } from '../../../Fixtures/Application/Provider/ComponentProviderClass.ts';
import { EventComponentProviderClass } from '../../../Fixtures/Application/Provider/EventComponentProviderClass.ts';
import { HttpComponentProviderClass } from '../../../Fixtures/Application/Provider/HttpComponentProviderClass.ts';
import { HttpContainerDataProviderClass } from '../../../Fixtures/Application/Provider/HttpContainerDataProviderClass.ts';
import { HttpRouteComponentProviderClass } from '../../../Fixtures/Application/Provider/HttpRouteComponentProviderClass.ts';
import { HttpRouteProviderClass } from '../../../Fixtures/Application/Provider/HttpRouteProviderClass.ts';
import { HttpRoutingDataProviderClass } from '../../../Fixtures/Application/Provider/HttpRoutingDataProviderClass.ts';
import { ListenerProviderClass } from '../../../Fixtures/Event/Provider/ListenerProviderClass.ts';

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
        const config = makeConfig([new CliWithHttpApplicationComponentProvider(), new CliComponentProviderClass()]);

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
        expect(providers[7]).toBeInstanceOf(CliComponentProviderClass);
    });

    it('getProviders expands nested component providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderClass()]));

        const providers = application.getProviders();

        expect(providers).toHaveLength(3);
        expect(providers[0]).toBeInstanceOf(CliComponentProviderClass);
        expect(providers[1]).toBeInstanceOf(HttpComponentProviderClass);
        expect(providers[2]).toBeInstanceOf(ComponentProviderClass);
    });

    it('getProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderClass()]));

        expect(internals(application).providers).toStrictEqual([]);

        const result = application.getProviders();

        expect(result).toHaveLength(3);
        expect(internals(application).providers).toBe(result);
        expect(application.getProviders()).toBe(result);
    });

    it('getContainerProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderClass()]));

        const result = application.getContainerProviders();

        expect(result).toHaveLength(4);
        expect(result[0]).toBeInstanceOf(CliContainerDataProviderClass);
        expect(result[1]).toBeInstanceOf(CliRoutingDataProviderClass);
        expect(result[2]).toBeInstanceOf(HttpContainerDataProviderClass);
        expect(result[3]).toBeInstanceOf(HttpRoutingDataProviderClass);
    });

    it('getContainerProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new ComponentProviderClass()]));

        expect(internals(application).serviceProviders).toStrictEqual([]);

        const result = application.getContainerProviders();

        expect(result).toHaveLength(4);
        expect(internals(application).serviceProviders).toBe(result);
        expect(application.getContainerProviders()).toBe(result);
    });

    it('getEventProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new EventComponentProviderClass()]));

        const result = application.getEventProviders();

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(ListenerProviderClass);
    });

    it('getEventProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new EventComponentProviderClass()]));

        expect(internals(application).eventProviders).toStrictEqual([]);

        const result = application.getEventProviders();

        expect(result).toHaveLength(1);
        expect(internals(application).eventProviders).toBe(result);
        expect(application.getEventProviders()).toBe(result);
    });

    it('getCliProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new CliRouteComponentProviderClass()]));

        const result = application.getCliProviders();

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(CliRouteProviderClass);
    });

    it('getCliProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new CliRouteComponentProviderClass()]));

        expect(internals(application).cliRouteProviders).toStrictEqual([]);

        const result = application.getCliProviders();

        expect(result).toHaveLength(1);
        expect(internals(application).cliRouteProviders).toBe(result);
        expect(application.getCliProviders()).toBe(result);
    });

    it('getHttpProviders collects results from all expanded providers', () => {
        const application = new Valkyrja(new Container(), makeConfig([new HttpRouteComponentProviderClass()]));

        const result = application.getHttpProviders();

        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(HttpRouteProviderClass);
    });

    it('getHttpProviders caches its result', () => {
        const application = new Valkyrja(new Container(), makeConfig([new HttpRouteComponentProviderClass()]));

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

        expect(() => application.publishProviderCallbacks()).not.toThrow();
    });
});
