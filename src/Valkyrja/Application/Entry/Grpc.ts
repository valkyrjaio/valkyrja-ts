/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcServerServiceId } from '../../Grpc/Server/Constant/GrpcServerServiceId.ts';
import { App } from './Abstract/App.ts';

import type { ServiceCallContract } from '../../Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { ServiceHandlerContract } from '../../Grpc/Server/Handler/Contract/ServiceHandlerContract.ts';
import type { GrpcConfigContract } from '../Data/Contract/GrpcConfigContract.ts';

export class Grpc extends App {
    static async handle(config: GrpcConfigContract, call: ServiceCallContract): Promise<ServiceResponseContract> {
        const app = this.start(config);
        const container = app.getContainer();

        this.bootstrapThrowableHandler(app, container);

        const handler = container.getSingleton<ServiceHandlerContract>(GrpcServerServiceId.ServiceHandlerContract);
        const response = await handler.run(call);

        await handler.terminate(call, response);

        return response;
    }
}
