import { rename, copyFile, unlink, access, constants } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { dirname } from 'node:path';
import type { UploadedFileContract } from './Contract/UploadedFileContract.js';
import type { StreamContract } from '../Stream/Contract/StreamContract.js';
import { Stream } from '../Stream/Stream.js';
import { UploadedFileAlreadyMovedException } from './Throwable/Exception/UploadedFileAlreadyMovedException.js';
import { UploadedFileInvalidDirectoryException } from './Throwable/Exception/UploadedFileInvalidDirectoryException.js';
import { UploadedFileInvalidUploadedFileException } from './Throwable/Exception/UploadedFileInvalidUploadedFileException.js';
import { UploadedFileMoveFailureException } from './Throwable/Exception/UploadedFileMoveFailureException.js';
import { UploadedFileUnableToWriteFileException } from './Throwable/Exception/UploadedFileUnableToWriteFileException.js';

export class UploadedFile implements UploadedFileContract {
    protected hasBeenMoved: boolean = false;

    constructor(
        protected file: string | null = null,
        protected stream: StreamContract | null = null,
        protected uploadError: Error | null = null,
        protected size: number = 0,
        protected fileName: string = '',
        protected mediaType: string = ''
    ) {
        if (uploadError === null && file === null && stream === null) {
            throw new UploadedFileInvalidUploadedFileException('One of file or stream are required');
        }
    }

    getStream(): StreamContract {
        this.validateNoUploadError();
        this.validateHasNotBeenMoved('Cannot retrieve stream after it has already been moved');

        if (this.stream !== null) {
            return this.stream;
        }

        if (this.file === null) {
            throw new UploadedFileInvalidUploadedFileException('One of file or stream are required');
        }

        this.stream = new Stream(this.file);
        return this.stream;
    }

    async moveTo(targetPath: string): Promise<void> {
        this.validateNoUploadError();
        this.validateHasNotBeenMoved();

        const targetDir = dirname(targetPath);
        await this.validateTargetDirectory(targetDir);

        if (this.file === null || this.file === '') {
            await this.moveViaStream(targetPath);
        } else {
            await this.moveViaFs(targetPath);
        }

        this.hasBeenMoved = true;
    }

    hasSize(): boolean {
        return this.size !== 0;
    }

    getSize(): number {
        return this.size;
    }

    getError(): Error | null {
        return this.uploadError;
    }

    hasClientFilename(): boolean {
        return this.fileName !== '';
    }

    getClientFilename(): string {
        return this.fileName;
    }

    hasClientMediaType(): boolean {
        return this.mediaType !== '';
    }

    getClientMediaType(): string {
        return this.mediaType;
    }

    protected validateNoUploadError(): void {
        if (this.uploadError !== null) {
            throw this.uploadError;
        }
    }

    protected validateHasNotBeenMoved(message?: string): void {
        if (this.hasBeenMoved) {
            throw new UploadedFileAlreadyMovedException(
                message ?? 'Cannot move file after it has already been moved'
            );
        }
    }

    protected async validateTargetDirectory(dir: string): Promise<void> {
        try {
            await access(dir, constants.W_OK);
        } catch {
            throw new UploadedFileInvalidDirectoryException(
                `The target directory \`${dir}\` does not exist or is not writable`
            );
        }
    }

    protected async moveViaStream(targetPath: string): Promise<void> {
        const stream = this.getStream();
        stream.rewind();

        await new Promise<void>((resolve, reject) => {
            const writer = createWriteStream(targetPath);
            writer.on('error', () => reject(new UploadedFileUnableToWriteFileException('Unable to write to designated path')));
            writer.on('finish', resolve);

            while (!stream.eof()) {
                writer.write(stream.read(4096));
            }

            writer.end();
        });

        this.stream?.close();
    }

    protected async moveViaFs(targetPath: string): Promise<void> {
        try {
            await rename(this.file!, targetPath);
        } catch {
            try {
                await copyFile(this.file!, targetPath);
                await unlink(this.file!);
            } catch {
                throw new UploadedFileMoveFailureException('Error occurred while moving uploaded file');
            }
        }
    }
}