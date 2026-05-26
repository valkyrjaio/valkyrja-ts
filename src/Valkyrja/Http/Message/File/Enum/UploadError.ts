/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export enum UploadError {
    OK = 0,
    INI_SIZE = 1,
    FORM_SIZE = 2,
    PARTIAL = 3,
    NO_FILE = 4,
    NO_TMP_DIR = 6,
    CANT_WRITE = 7,
    EXTENSION = 8,
}
