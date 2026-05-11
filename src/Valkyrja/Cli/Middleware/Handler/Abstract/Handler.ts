import { Container } from '../../../../Container/Manager/Container.js';

import type { ContainerContract } from '../../../../Container/Manager/Contract/ContainerContract.js';
import type { HandlerContract } from '../Contract/HandlerContract.js';

export abstract class Handler implements HandlerContract {
    protected middleware: string[] = [];
    protected next:       string | null = null;
    protected index:      number = 0;

    constructor(
        protected container: ContainerContract = new Container(),
        ...middleware: string[]
    ) {
        this.middleware = middleware;

        this.updateNext();
    }

    add(...middleware: string[]): void {
        this.middleware = [...this.middleware, ...middleware];

        this.updateNext();
    }

    protected getMiddleware<T extends object>(middleware: string): T {
        const item = this.container.get<T>(middleware);

        this.index++;

        this.updateNext();

        return item;
    }

    protected updateNext(): void {
        this.next = this.middleware[this.index] ?? null;
    }
}
