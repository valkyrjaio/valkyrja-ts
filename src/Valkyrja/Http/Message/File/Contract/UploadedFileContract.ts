/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { StreamContract } from '../../Stream/Contract/StreamContract.ts';

export interface UploadedFileContract {
    getStream(): StreamContract;
    moveTo(targetPath: string): Promise<void>;
    hasSize(): boolean;
    getSize(): number;
    getError(): Error | null;
    hasClientFilename(): boolean;
    getClientFilename(): string;
    hasClientMediaType(): boolean;
    getClientMediaType(): string;
}
