/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { UploadedFile } from '../../../../../../src/Valkyrja/Http/Message/File/UploadedFile.ts';

/**
 * An UploadedFile that bypasses the constructor invariant, leaving neither a file nor a stream.
 */
export class InvalidUploadedFileExceptionFixture extends UploadedFile {
    constructor() {
        super('test');

        this.file = null;
        this.stream = null;
    }

    public callMoveViaFs(targetPath: string): Promise<void> {
        return this.moveViaFs(targetPath);
    }
}
