/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { RouteCollection } from '../../../../../../src/Valkyrja/Grpc/Routing/Collection/RouteCollection.ts';
import { GrpcRoutingInvalidMethodException } from '../../../../../../src/Valkyrja/Grpc/Routing/Throwable/Exception/GrpcRoutingInvalidMethodException.ts';
import { RouteFixture } from '../../../../Fixtures/Grpc/Routing/RouteFixture.ts';

describe('RouteCollection', () => {
    it('starts empty', () => {
        const collection = new RouteCollection();

        expect(collection.has('/pkg.Service/Method')).toBe(false);
        expect(collection.all().size).toBe(0);
    });

    it('keys each route by its fully-qualified method', () => {
        const first = RouteFixture.make('/pkg.Service/First');
        const second = RouteFixture.make('/pkg.Service/Second');
        const collection = new RouteCollection().add(first, second);

        expect(collection.get('/pkg.Service/First')).toBe(first);
        expect(collection.get('/pkg.Service/Second')).toBe(second);
        expect(collection.has('/pkg.Service/First')).toBe(true);
        expect([...collection.all().keys()]).toEqual(['/pkg.Service/First', '/pkg.Service/Second']);
    });

    it('returns itself so adds can chain', () => {
        const collection = new RouteCollection();

        expect(collection.add(RouteFixture.make())).toBe(collection);
    });

    it('replaces a route registered under the same method', () => {
        const first = RouteFixture.make('/pkg.Service/Method');
        const second = RouteFixture.make('/pkg.Service/Method');
        const collection = new RouteCollection().add(first).add(second);

        expect(collection.get('/pkg.Service/Method')).toBe(second);
        expect(collection.all().size).toBe(1);
    });

    it('throws for a method it does not hold', () => {
        expect(() => new RouteCollection().get('/pkg.Service/Missing')).toThrow(GrpcRoutingInvalidMethodException);
        expect(() => new RouteCollection().get('/pkg.Service/Missing')).toThrow(
            'The route `/pkg.Service/Missing` was not found.',
        );
    });

    it('hands out a copy of the map', () => {
        const collection = new RouteCollection().add(RouteFixture.make());

        collection.all().delete('/pkg.Service/Method');

        expect(collection.has('/pkg.Service/Method')).toBe(true);
    });
});
