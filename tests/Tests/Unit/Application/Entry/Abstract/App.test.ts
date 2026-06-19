/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Config } from '../../../../../../src/Valkyrja/Application/Data/Config.ts';
import { Directory } from '../../../../../../src/Valkyrja/Application/Directory/Directory.ts';
import { App } from '../../../../../../src/Valkyrja/Application/Entry/Abstract/App.ts';
import { Valkyrja } from '../../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { ThrowableServiceId } from '../../../../../../src/Valkyrja/Throwable/Constant/ThrowableServiceId.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

import type { ApplicationContract } from '../../../../../../src/Valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

describe('App', () => {
    it('directory sets the base path', () => {
        App.directory('/tmp/valkyrja-app-test');

        expect(Directory.basePath).toBe('/tmp/valkyrja-app-test');
    });

    it('appStart records a start time and is idempotent', () => {
        expect(() => {
            App.appStart();
            App.appStart();
        }).not.toThrow();
    });

    it('getContainer returns a new container', () => {
        expect(App.getContainer()).toBeInstanceOf(Container);
    });

    it('getApplication returns a Valkyrja using the given container', () => {
        const container = new Container();

        const app = App.getApplication(container, new Config());

        expect(app).toBeInstanceOf(Valkyrja);
        expect(app.getContainer()).toBe(container);
    });

    it('getThrowableHandler returns an enableable handler', () => {
        const handler = App.getThrowableHandler();

        expect(() => handler.enable({ displayErrors: true })).not.toThrow();
    });

    it('defaultExceptionHandler does not throw', () => {
        expect(() => App.defaultExceptionHandler()).not.toThrow();
    });

    it('app bootstraps an application and registers the config', () => {
        const config = new Config();

        const app = App.app(config);

        expect(app).toBeInstanceOf(Valkyrja);
        expect(app.getContainer().getSingleton(ApplicationServiceId.Config)).toBe(config);
    });

    it('start bootstraps the application without debug mode', () => {
        const app = App.start(new Config());

        expect(app).toBeInstanceOf(Valkyrja);
    });

    it('start invokes the default exception handler in debug mode', () => {
        const config = new Config('App', process.cwd(), undefined, undefined, true);

        const app = App.start(config);

        expect(app).toBeInstanceOf(Valkyrja);
        expect(app.getDebugMode()).toBe(true);
    });

    it('bootstrapThrowableHandler registers a handler when debug mode is enabled', () => {
        const container = new Container();
        const app = { getDebugMode: (): boolean => true } as unknown as ApplicationContract;

        App.bootstrapThrowableHandler(app, container);

        expect(container.isSingleton(ThrowableServiceId.HandlerContract)).toBe(true);
    });

    it('bootstrapThrowableHandler does nothing when debug mode is disabled', () => {
        const container = new Container();
        const app = { getDebugMode: (): boolean => false } as unknown as ApplicationContract;

        App.bootstrapThrowableHandler(app, container);

        expect(container.isSingleton(ThrowableServiceId.HandlerContract)).toBe(false);
    });
});
