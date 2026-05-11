import { Container } from '../../../../Container/Manager/Container.js';

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.js';
import type { AnyMiddleware, HandlerContract } from '../Contract/HandlerContract.js';

export abstract class Handler<Middleware extends AnyMiddleware = AnyMiddleware> implements HandlerContract<Middleware> {
    protected middleware: Array<new (...args: unknown[]) => Middleware>;
    protected next: (new (...args: unknown[]) => Middleware) | null;
    protected index: number;

    constructor(
        protected container: ContainerContract = new Container(),
        ...middleware: Array<new (...args: unknown[]) => Middleware>
    ) {
        this.middleware = middleware;
        this.index      = 0;
        this.next       = null;

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