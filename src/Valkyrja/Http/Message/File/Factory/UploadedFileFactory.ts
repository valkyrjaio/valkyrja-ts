/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
