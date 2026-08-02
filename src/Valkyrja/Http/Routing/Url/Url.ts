/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
