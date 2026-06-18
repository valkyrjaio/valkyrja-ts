/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { IncomingMessage } from 'node:http';

import { beforeEach, describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '../../../../../../src/Valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Config } from '../../../../../../src/Valkyrja/Application/Data/Config.ts';
import { WorkerHttp } from '../../../../../../src/Valkyrja/Application/Entry/Abstract/WorkerHttp.ts';
import { ChildApplication } from '../../../../../../src/Valkyrja/Application/Kernel/ChildApplication.ts';
import { Valkyrja } from '../../../../../../src/Valkyrja/Application/Kernel/Valkyrja.ts';
import { ContainerServiceId } from '../../../../../../src/Valkyrja/Container/Constant/ContainerServiceId.ts';
import { ContainerData } from '../../../../../../src/Valkyrja/Container/Data/ContainerData.ts';
import { ChildContainer } from '../../../../../../src/Valkyrja/Container/Manager/ChildContainer.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';
import { ServerRequest } from '../../../../../../src/Valkyrja/Http/Message/Request/ServerRequest.ts';

// bootstrap()/handle() drive the full container + request handler (integration — covered functionally);
// these unit tests cover the request-scoped seams.
describe('WorkerHttp', () => {
    let parentContainer: Container;
    let app: Valkyrja;

    beforeEach(() => {
        parentContainer = new Container();
        app = new Valkyrja(parentContainer, new Config());
    });

    it('getChildContainer creates a ChildContainer from the parent container', () => {
        expect(WorkerHttp.getChildContainer(app, new ContainerData())).toBeInstanceOf(ChildContainer);
    });

    it('getChildApplication creates a ChildApplication', () => {
        expect(WorkerHttp.getChildApplication(app, new Container())).toBeInstanceOf(ChildApplication);
    });

    it('bootstrapChildContainer registers the application and container singletons', () => {
        const childContainer = new ChildContainer(parentContainer, new ContainerData());
        const childApp = WorkerHttp.getChildApplication(app, childContainer);

        WorkerHttp.bootstrapChildContainer(childApp, childContainer);

        expect(childContainer.getSingleton(ApplicationServiceId.ApplicationContract)).toBe(childApp);
        expect(childContainer.getSingleton(ContainerServiceId.Contract)).toBe(childContainer);
    });

    it('getRequest builds a server request from a node request', () => {
        const nodeRequest = {
            headers: {},
            url: '/',
            method: 'GET',
            httpVersion: '1.1',
            socket: {},
        } as unknown as IncomingMessage;

        expect(WorkerHttp.getRequest(nodeRequest)).toBeInstanceOf(ServerRequest);
    });
});
