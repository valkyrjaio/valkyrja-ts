/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { RouteCollectionContract } from '../Collection/Contract/RouteCollectionContract.ts';
import type { UrlContract } from './Contract/UrlContract.ts';

export class Url implements UrlContract {
    constructor(protected collection: RouteCollectionContract) {}

    getUrl(name: string, data: Record<string, string | number>): string {
        const route = this.collection.getByName(name);

        let path = route.getPath();

        for (const [key, value] of Object.entries(data)) {
            path = path.replace('{' + key + '}', String(value));
        }

        return path;
    }
}
