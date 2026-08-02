/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ServiceHandlerContract } from '../../Handler/Contract/ServiceHandlerContract.ts';

/**
 * Bridges an external gRPC server implementation (`@grpc/grpc-js`, grpc-java, grpc-go, …) to the
 * framework's {@link ServiceHandlerContract}.
 *
 * This interface is part of the worker-agnostic surface — portable across every language port —
 * even though implementations are per-worker. An adapter accepts native calls, builds a
 * `ServiceCall`, hands it to the `ServiceHandler`, and translates the returned `ServiceResponse`
 * back to the library's native response API. Adapter-specific configuration (TLS, port binding)
 * lives on the implementation, not here.
 */
export interface ServiceAdapterContract {
    /** Begin accepting calls, dispatching each to the given handler. */
    start(handler: ServiceHandlerContract): Promise<void>;

    /** Gracefully stop accepting calls and shut down. */
    stop(): Promise<void>;
}
