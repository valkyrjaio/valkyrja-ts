/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { RequestMethod } from '../../../../../../src/Valkyrja/Http/Message/Enum/RequestMethod.ts';
import { RouteCollection } from '../../../../../../src/Valkyrja/Http/Routing/Collection/RouteCollection.ts';
import { Route } from '../../../../../../src/Valkyrja/Http/Routing/Data/Route.ts';
import { Url } from '../../../../../../src/Valkyrja/Http/Routing/Url/Url.ts';

import type { ResponseContract } from '../../../../../../src/Valkyrja/Http/Message/Response/Contract/ResponseContract.ts';

const handler = (): ResponseContract => ({}) as unknown as ResponseContract;

describe('Url', () => {
    it('builds a url from a route name, substituting parameters', () => {
        const collection = new RouteCollection();
        collection.add(new Route('/users/{id}/posts/{post}', 'users.posts', handler, [RequestMethod.GET]));

        const url = new Url(collection);

        expect(url.getUrl('users.posts', { id: 5, post: 'hello' })).toBe('/users/5/posts/hello');
    });
});
