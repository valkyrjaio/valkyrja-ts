/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
