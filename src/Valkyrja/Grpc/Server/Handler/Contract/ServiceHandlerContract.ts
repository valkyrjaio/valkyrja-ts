/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';

/**
 * The gRPC kernel entry point, analogous to HTTP's `RequestHandler` and CLI's `InputHandler`.
 *
 * Orchestrates the pipeline — `CallReceived` → `Router` → `ThrowableCaught` (via `handle`), then
 * `SendingResponse` (via `sending`) and `ResponseSent` (via `terminate`). The wire write itself is
 * the adapter's job and happens between `sending` and `terminate`; `run` bundles handle+sending so
 * the adapter can write the returned response and then call `terminate`.
 */
export interface ServiceHandlerContract {
    /**
     * Run `CallReceived` → `Router`, converting any thrown throwable via `ThrowableCaught`. Includes
     * the entry-point cancellation pre-check.
     */
    handle(call: ServiceCallContract): Promise<ServiceResponseContract>;

    /**
     * Run the `SendingResponse` stage over a response. Always runs, including on error and
     * cancellation paths.
     */
    sending(call: ServiceCallContract, response: ServiceResponseContract): Promise<ServiceResponseContract>;

    /** Run the `ResponseSent` stage after the response has been written to the wire. */
    terminate(call: ServiceCallContract, response: ServiceResponseContract): Promise<void>;

    /**
     * Convenience: `handle` then `sending`. The adapter writes the returned response to the wire,
     * then calls `terminate`.
     */
    run(call: ServiceCallContract): Promise<ServiceResponseContract>;
}
