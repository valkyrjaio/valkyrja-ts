/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { GrpcMessageServiceId } from '../../../../../../src/Valkyrja/Grpc/Message/Constant/GrpcMessageServiceId.ts';

describe('GrpcMessageServiceId', () => {
    it('namespaces every binding key under the gRPC component', () => {
        const ids = Object.values(GrpcMessageServiceId) as string[];

        expect(ids).toHaveLength(2);

        for (const id of ids) {
            expect(id).toMatch(/^Valkyrja\.Grpc\./);
        }
    });

    it('keeps every binding key unique', () => {
        const ids = Object.values(GrpcMessageServiceId) as string[];

        expect(new Set(ids).size).toBe(ids.length);
    });
});
