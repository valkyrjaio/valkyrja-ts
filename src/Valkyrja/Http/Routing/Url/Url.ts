import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.js';
import type { UrlContract } from './Contract/UrlContract.js';

export class Url implements UrlContract {
    constructor(
        protected collection: RouteCollectionContract,
    ) {}

    getUrl(name: string, data: Record<string, string | number>): string {
        const route = this.collection.getByName(name);

        let path = route.getPath();

        for (const [key, value] of Object.entries(data)) {
            path = path.replace('{' + key + '}', String(value));
        }

        return path;
    }
}