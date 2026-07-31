/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcRuntimeException } from './Abstract/GrpcRuntimeException.ts';

/**
 * Thrown when metadata is added with a value whose type does not match its key's kind — a `-bin`
 * key requires bytes, every other key requires a string. Raised at the point of insertion so a
 * mismatch fails fast rather than as a stringified byte array when the response is written.
 */
export class MetadataInvalidValueException extends GrpcRuntimeException {}
