/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceHandlerContract } from '../../Handler/Contract/ServiceHandlerContract.ts';

export interface ServiceAdapterContract {
    /** Begin accepting calls, dispatching each to the given handler. */
    start(handler: ServiceHandlerContract): Promise<void>;

    /** Gracefully stop accepting calls and shut down. */
    stop(): Promise<void>;
}
