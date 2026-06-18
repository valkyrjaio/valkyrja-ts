/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { UploadedFileThrowable } from '../../Contract/UploadedFileThrowable.ts';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.ts';

export abstract class UploadedFileInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements UploadedFileThrowable {}
