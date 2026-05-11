import type { StreamContract } from '../../Stream/Contract/StreamContract.js';

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