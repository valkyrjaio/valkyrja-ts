/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpMessageServiceId } from '../../../../../../src/Valkyrja/Http/Message/Constant/HttpMessageServiceId.ts';
import { ResponseFactory } from '../../../../../../src/Valkyrja/Http/Message/Response/Factory/ResponseFactory.ts';
import { HttpMessageServiceProvider } from '../../../../../../src/Valkyrja/Http/Message/Provider/HttpMessageServiceProvider.ts';
import { Container } from '../../../../../../src/Valkyrja/Container/Manager/Container.ts';

describe('HttpMessageServiceProvider', () => {
    it('publishes the response factory id', () => {
        const publishers = new HttpMessageServiceProvider().publishers();

        expect(HttpMessageServiceId.ResponseFactoryContract in publishers).toBe(true);
    });

    it('publishResponseFactory registers a response factory singleton', () => {
        const container = new Container();

        HttpMessageServiceProvider.publishResponseFactory(container);

        expect(container.getSingleton(HttpMessageServiceId.ResponseFactoryContract)).toBeInstanceOf(ResponseFactory);
    });
});
