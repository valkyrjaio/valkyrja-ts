/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HttpThrowable } from '../../Contract/HttpThrowable.ts';
import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';

export abstract class HttpInvalidArgumentException extends ValkyrjaInvalidArgumentException implements HttpThrowable {}
