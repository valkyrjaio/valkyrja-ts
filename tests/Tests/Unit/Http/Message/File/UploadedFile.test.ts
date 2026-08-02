/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { access, copyFile, rename, unlink } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Stream } from '../../../../../../src/Valkyrja/Http/Message/Stream/Stream.ts';
import { UploadedFile } from '../../../../../../src/Valkyrja/Http/Message/File/UploadedFile.ts';
import { UploadedFileAlreadyMovedException } from '../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileAlreadyMovedException.ts';
import { UploadedFileInvalidDirectoryException } from '../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileInvalidDirectoryException.ts';
import { UploadedFileInvalidUploadedFileException } from '../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileInvalidUploadedFileException.ts';
import { UploadedFileMoveFailureException } from '../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileMoveFailureException.ts';
import { UploadedFileUnableToWriteFileException } from '../../../../../../src/Valkyrja/Http/Message/File/Throwable/Exception/UploadedFileUnableToWriteFileException.ts';
import { InvalidUploadedFileExceptionFixture } from '../../../../Fixtures/Http/Message/File/InvalidUploadedFileExceptionFixture.ts';

vi.mock('node:fs/promises', () => ({
    rename: vi.fn(),
    copyFile: vi.fn(),
    unlink: vi.fn(),
    access: vi.fn(),
    constants: { W_OK: 2 },
}));
vi.mock('node:fs', () => ({ createWriteStream: vi.fn() }));

const accessMock = vi.mocked(access);
const renameMock = vi.mocked(rename);
const copyFileMock = vi.mocked(copyFile);
const unlinkMock = vi.mocked(unlink);
const createWriteStreamMock = vi.mocked(createWriteStream);

function fakeWriter(failOnWrite = false): unknown {
    const listeners: Record<string, () => void> = {};

    return {
        on(event: string, cb: () => void): unknown {
            listeners[event] = cb;

            return this;
        },
        write(): void {
            if (failOnWrite) {
                listeners['error']?.();
            }
        },
        end(): void {
            listeners['finish']?.();
        },
    };
}

beforeEach(() => {
    accessMock.mockResolvedValue(undefined);
    renameMock.mockResolvedValue(undefined);
    copyFileMock.mockResolvedValue(undefined);
    unlinkMock.mockResolvedValue(undefined);
    createWriteStreamMock.mockReturnValue(fakeWriter() as never);
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('UploadedFile', () => {
    it('requires a file, stream, or error', () => {
        expect(() => new UploadedFile()).toThrow(UploadedFileInvalidUploadedFileException);
        expect(() => new UploadedFile('/tmp/upload')).not.toThrow();
    });

    it('exposes its metadata', () => {
        const file = new UploadedFile('/tmp/upload', null, null, 42, 'photo.png', 'image/png');

        expect(file.hasSize()).toBe(true);
        expect(file.getSize()).toBe(42);
        expect(file.getError()).toBeNull();
        expect(file.hasClientFilename()).toBe(true);
        expect(file.getClientFilename()).toBe('photo.png');
        expect(file.hasClientMediaType()).toBe(true);
        expect(file.getClientMediaType()).toBe('image/png');
    });

    it('lazily builds a stream from the file and returns a provided stream', () => {
        const fromFile = new UploadedFile('/tmp/upload');
        expect(fromFile.getStream()).toBeInstanceOf(Stream);

        const provided = new Stream('data');
        expect(new UploadedFile(null, provided).getStream()).toBe(provided);
    });

    it('throws the upload error when one is present', () => {
        const error = new Error('upload failed');

        expect(() => new UploadedFile(null, null, error).getStream()).toThrow('upload failed');
    });

    it('throws when neither a file nor a stream is available to build a stream', () => {
        expect(() => new InvalidUploadedFileExceptionFixture().getStream()).toThrow(
            UploadedFileInvalidUploadedFileException,
        );
    });

    it('throws when moving via the filesystem without a file path', async () => {
        await expect(new InvalidUploadedFileExceptionFixture().callMoveViaFs('/tmp/target/file.png')).rejects.toThrow(
            UploadedFileInvalidUploadedFileException,
        );
    });

    it('moves a file via the filesystem', async () => {
        const file = new UploadedFile('/tmp/upload');

        await file.moveTo('/tmp/target/file.png');

        expect(renameMock).toHaveBeenCalledWith('/tmp/upload', '/tmp/target/file.png');
    });

    it('falls back to copy + unlink when rename fails', async () => {
        renameMock.mockRejectedValueOnce(new Error('cross-device'));
        const file = new UploadedFile('/tmp/upload');

        await file.moveTo('/tmp/target/file.png');

        expect(copyFileMock).toHaveBeenCalledTimes(1);
        expect(unlinkMock).toHaveBeenCalledTimes(1);
    });

    it('throws when both rename and copy fail', async () => {
        renameMock.mockRejectedValueOnce(new Error('x'));
        copyFileMock.mockRejectedValueOnce(new Error('y'));
        const file = new UploadedFile('/tmp/upload');

        await expect(file.moveTo('/tmp/target/file.png')).rejects.toThrow(UploadedFileMoveFailureException);
    });

    it('moves a stream-backed file by writing it out', async () => {
        const file = new UploadedFile(null, new Stream('hello world'));

        await file.moveTo('/tmp/target/file.txt');

        expect(createWriteStreamMock).toHaveBeenCalledWith('/tmp/target/file.txt');
    });

    it('rejects when the write stream errors', async () => {
        createWriteStreamMock.mockReturnValue(fakeWriter(true) as never);
        const file = new UploadedFile(null, new Stream('hello world'));

        await expect(file.moveTo('/tmp/target/file.txt')).rejects.toThrow(UploadedFileUnableToWriteFileException);
    });

    it('throws when the target directory is not writable', async () => {
        accessMock.mockRejectedValueOnce(new Error('no access'));
        const file = new UploadedFile('/tmp/upload');

        await expect(file.moveTo('/tmp/target/file.png')).rejects.toThrow(UploadedFileInvalidDirectoryException);
    });

    it('cannot be moved or read twice', async () => {
        const file = new UploadedFile('/tmp/upload');
        await file.moveTo('/tmp/target/file.png');

        await expect(file.moveTo('/tmp/target/again.png')).rejects.toThrow(UploadedFileAlreadyMovedException);
        expect(() => file.getStream()).toThrow(UploadedFileAlreadyMovedException);
    });
});
