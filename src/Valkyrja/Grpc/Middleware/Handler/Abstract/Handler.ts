/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Container } from '../../../../Container/Manager/Container.ts';
import { Cancellation } from '../../../Support/Cancellation.ts';

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.ts';
import type { ServiceCallContract } from '../../../Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '../../../Message/Response/Contract/ServiceResponseContract.ts';
import type { AnyMiddleware, HandlerContract } from '../Contract/HandlerContract.ts';

/**
 * The middleware-chain orchestrator base, shared by every stage handler.
 *
 * Holds the ordered middleware for a stage and walks the chain: each call to
 * {@link Handler.getMiddleware} resolves the next middleware from the container and advances the
 * cursor, so a middleware that returns without re-invoking its handler structurally short-circuits
 * the remainder.
 *
 * The two-question cancellation check lives here in {@link Handler.checkCancellation} so every
 * request-processing stage inherits it — the pre-check runs before delegating to the wrapped
 * middleware and the post-check on its return. The always-run stages (`SendingResponse`,
 * `ResponseSent`) deliberately skip the check: per the fast-exit path they run even for cancelled
 * calls.
 */
export abstract class Handler<Middleware extends AnyMiddleware = AnyMiddleware> implements HandlerContract<Middleware> {
    protected middleware: Array<new (...args: unknown[]) => Middleware>;
    protected next: (new (...args: unknown[]) => Middleware) | null;
    protected index: number;

    constructor(
        protected container: ContainerContract = new Container(),
        ...middleware: Array<new (...args: unknown[]) => Middleware>
    ) {
        this.middleware = middleware;
        this.index = 0;
        this.next = null;

        this.updateNext();
    }

    add(...middleware: Array<new (...args: unknown[]) => Middleware>): void {
        this.middleware = [...this.middleware, ...middleware];

        this.updateNext();
    }

    protected getMiddleware(middleware: new (...args: unknown[]) => Middleware): Middleware {
        const item = this.container.get<Middleware & object>(middleware.name);

        this.index++;

        this.updateNext();

        return item;
    }

    protected updateNext(): void {
        this.next = this.middleware[this.index] ?? null;
    }

    /**
     * Run the two-question cancellation check for a request-processing stage.
     *
     * @return a cancellation response to fast-exit with, or null to continue normally
     */
    protected checkCancellation(
        call: ServiceCallContract,
        response: ServiceResponseContract | null = null,
    ): ServiceResponseContract | null {
        return Cancellation.checkAndFinalize(call, response);
    }
}
