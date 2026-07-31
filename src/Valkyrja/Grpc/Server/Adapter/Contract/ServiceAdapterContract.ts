/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
