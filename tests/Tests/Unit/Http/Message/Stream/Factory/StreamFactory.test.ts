/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StreamFactory } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Factory/StreamFactory.ts';
import { HttpStreamStreamReadException } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamStreamReadException.ts';
import { HttpStreamStreamSeekException } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamStreamSeekException.ts';
import { HttpStreamStreamTellException } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamStreamTellException.ts';
import { HttpStreamStreamWriteException } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Throwable/Exception/HttpStreamStreamWriteException.ts';

import type { StreamContract } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Contract/StreamContract.ts';

describe('StreamFactory', () => {
    it('detects writeable modes from a mode string', () => {
        for (const mode of ['x', 'w', 'c', 'a', 'r+']) {
            expect(StreamFactory.isModeWriteable(mode)).toBe(true);
        }
        expect(StreamFactory.isModeWriteable('r')).toBe(false);
    });

    it('detects readable modes from a mode string', () => {
        expect(StreamFactory.isModeReadable('r')).toBe(true);
        expect(StreamFactory.isModeReadable('w+')).toBe(true);
        expect(StreamFactory.isModeReadable('w')).toBe(false);
    });

    it('verifies write results', () => {
        expect(() => {
            StreamFactory.verifyWriteResult(5);
        }).not.toThrow();
        expect(() => {
            StreamFactory.verifyWriteResult(false);
        }).toThrow(HttpStreamStreamWriteException);
    });

    it('verifies read results', () => {
        expect(() => {
            StreamFactory.verifyReadResult('data');
        }).not.toThrow();
        expect(() => {
            StreamFactory.verifyReadResult(false);
        }).toThrow(HttpStreamStreamReadException);
    });

    it('verifies seek results', () => {
        expect(() => {
            StreamFactory.verifySeekResult(0);
        }).not.toThrow();
        expect(() => {
            StreamFactory.verifySeekResult(1);
        }).toThrow(HttpStreamStreamSeekException);
    });

    it('verifies tell results', () => {
        expect(() => {
            StreamFactory.verifyTellResult(5);
        }).not.toThrow();
        expect(() => {
            StreamFactory.verifyTellResult(false);
        }).toThrow(HttpStreamStreamTellException);
    });

    it('returns an empty string when reading the contents fails', () => {
        const stream = {
            isReadable: () => true,
            rewind: () => {},
            getContents: () => {
                throw new Error('boom');
            },
        } as unknown as StreamContract;

        expect(StreamFactory.toString(stream)).toBe('');
    });
});
