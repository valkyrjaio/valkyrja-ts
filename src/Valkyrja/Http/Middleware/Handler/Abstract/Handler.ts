/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Container } from '../../../../Container/Manager/Container.ts';

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.ts';
import type { AnyMiddleware, HandlerContract } from '../Contract/HandlerContract.ts';

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
        const item = this.container.get<Middleware>(middleware.name);

        this.index++;

        this.updateNext();

        return item;
    }

    protected updateNext(): void {
        this.next = this.middleware[this.index] ?? null;
    }
}
