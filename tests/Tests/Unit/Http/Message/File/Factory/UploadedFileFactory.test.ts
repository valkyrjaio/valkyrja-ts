/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Stream } from '../../../../../../../src/Valkyrja/Http/Message/Stream/Stream.ts';
import { UploadedFile } from '../../../../../../../src/Valkyrja/Http/Message/File/UploadedFile.ts';
import { UploadedFileFactory } from '../../../../../../../src/Valkyrja/Http/Message/File/Factory/UploadedFileFactory.ts';

describe('UploadedFileFactory', () => {
    it('creates an uploaded file from data with defaults', () => {
        const file = UploadedFileFactory.create({ file: '/tmp/upload', size: 10, fileName: 'a.txt' });

        expect(file).toBeInstanceOf(UploadedFile);
        expect(file.getSize()).toBe(10);
        expect(file.getClientFilename()).toBe('a.txt');
    });

    it('applies defaults for omitted file, size and file name', () => {
        const file = UploadedFileFactory.create({ stream: new Stream('data') });

        expect(file).toBeInstanceOf(UploadedFile);
        expect(file.getSize()).toBe(0);
        expect(file.getClientFilename()).toBe('');
    });
});
