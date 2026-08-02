/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcRuntimeException } from './Abstract/GrpcRuntimeException.ts';

/**
 * Thrown when metadata is added with a value whose type does not match its key's kind — a `-bin`
 * key requires bytes, every other key requires a string. Raised at the point of insertion so a
 * mismatch fails fast rather than as a stringified byte array when the response is written.
 */
export class MetadataInvalidValueException extends GrpcRuntimeException {}
