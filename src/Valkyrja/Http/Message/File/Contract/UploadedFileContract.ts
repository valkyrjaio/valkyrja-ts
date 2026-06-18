/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
