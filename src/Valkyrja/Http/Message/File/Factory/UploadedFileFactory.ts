/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { UploadedFileContract } from '../Contract/UploadedFileContract.ts';
import type { StreamContract } from '../../Stream/Contract/StreamContract.ts';
import { UploadedFile } from '../UploadedFile.ts';

export interface UploadedFileData {
    file?: string;
    stream?: StreamContract;
    error?: Error;
    size?: number;
    fileName?: string;
    mediaType?: string;
}

export abstract class UploadedFileFactory {
    static create(data: UploadedFileData): UploadedFileContract {
        return new UploadedFile(
            data.file ?? null,
            data.stream ?? null,
            data.error ?? null,
            data.size ?? 0,
            data.fileName ?? '',
            data.mediaType ?? '',
        );
    }
}
